from transformers import AutoProcessor, CLIPVisionModelWithProjection
from numpy import ndarray

# Load OpenAIs pretrained CLIP image model and processor
image_model = CLIPVisionModelWithProjection.from_pretrained("openai/clip-vit-base-patch32")
image_processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")

def create_image_embedding(image: ndarray):
    # Process/prepare the image for the CLIP image model
    processed_image = image_processor(images=image, return_tensors="pt")

    # Run the CLIP image model
    outputs = image_model(**processed_image)

    # Get the actual image vector
    return outputs.image_embeds.tolist()[0]