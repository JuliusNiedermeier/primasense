import { EmbeddingsClient } from './client.js';
import { parse } from 'valibot';
import { EmbeddingsResponseSchema } from './index.js';

const endpoint = 'text-embedding';

export const embedText = async (client: EmbeddingsClient, text: string) => {
  const url = new URL([client.baseURL, endpoint].join('/'));
  url.searchParams.append('text', text);
  const response = await fetch(url);
  const responseData = await response.json();
  return parse(EmbeddingsResponseSchema, responseData);
};
