from transformers import  AutoTokenizer, CLIPTextModelWithProjection

# Load OpenAIs pretrained CLIP text model and processor
text_model = CLIPTextModelWithProjection.from_pretrained("openai/clip-vit-base-patch32")
text_tokenizer = AutoTokenizer.from_pretrained("openai/clip-vit-base-patch32")

def create_text_embedding(text: str):
    # Tokenize the text
	text_inputs = text_tokenizer(text, padding=True, return_tensors="pt")

	# Run the CLIP text model
	text_outputs = text_model(**text_inputs)

	# Return the actual text vector
	return text_outputs.text_embeds.tolist()[0]