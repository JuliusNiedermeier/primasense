from base64 import b64encode
from cv2 import imencode
from fastapi import FastAPI, HTTPException, Request, Response, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import StreamingResponse
from create_image_embedding import create_image_embedding
from create_video_embeddings import create_video_embeddings
from create_text_embedding import create_text_embedding
import json
import numpy as np
import cv2
import tempfile

app = FastAPI()

# This is just a temporary global error handler and should be replaced with a more detailed error handling logic
# async def catch_exceptions_middleware(request: Request, call_next):
#     try:
#         return await call_next(request)
#     except Exception:
#         return Response("Internal server error", status_code=500)

# app.middleware('http')(catch_exceptions_middleware)

@app.post("/video-embeddings")
async def video_embeddings(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File is required")

    tf = tempfile.NamedTemporaryFile()
    tf.write(await file.read())

    embeddings = create_video_embeddings(tf.name)

    def generate_json_response():
        for frame, seconds_from_start, embedding in embeddings:
            _, frame_bytes = imencode('.jpg', frame)
            base64_frame = b64encode(frame_bytes).decode("utf-8")
            yield f'{json.dumps({"frame": base64_frame, "secondsFromStart": seconds_from_start, "embedding": embedding})}END_OF_FRAME'

        tf.close()

    return StreamingResponse(generate_json_response())

@app.get("/text-embedding")
def text_embedding(text: str):
    text_embedding = create_text_embedding(text)
    return text_embedding

@app.post("/image-embedding")
async def image_embedding(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is required")
    
    file_buffer = await file.read()
    npimg = np.frombuffer(file_buffer, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    # cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) # Converts from [G, R, B] to [R, G, B]
    return create_image_embedding(frame)