import { parse } from 'valibot';
import { EmbeddingsClient } from './client.js';
import { EmbeddingsResponseSchema } from './index.js';

const endpoint = 'image-embedding';

export const embedImage = async (client: EmbeddingsClient, image: Buffer) => {
  const imageBlob = new Blob([image], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', imageBlob);
  const response = await fetch([client.baseURL, endpoint].join('/'), { method: 'POST', body: formData });
  const responseData = await response.json();
  return parse(EmbeddingsResponseSchema, responseData);
};
