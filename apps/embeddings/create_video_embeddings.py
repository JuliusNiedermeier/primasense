import cv2
from transformers import AutoProcessor, CLIPVisionModelWithProjection
from create_image_embedding import create_image_embedding

image_model = CLIPVisionModelWithProjection.from_pretrained("openai/clip-vit-base-patch32")
image_processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")

class VideoOpenError(Exception):
    pass

def create_video_embeddings(video_path: str):
    video = cv2.VideoCapture(video_path)

    if not video.isOpened():
        raise VideoOpenError()
    
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_rate = video.get(cv2.CAP_PROP_FPS)
    
    for seconds_from_start in range(int(total_frames / frame_rate)):
        frame_index = int(seconds_from_start * frame_rate)
        video.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        _, frame = video.read()
        embedding = create_image_embedding(frame)
        yield (frame, seconds_from_start, embedding)

    video.release()