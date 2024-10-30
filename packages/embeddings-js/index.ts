import { array, number, Output } from 'valibot';

export * from './client.js';
export * from './embed-text.js';
export * from './embed-image.js';
export * from './embed-video.js';

export const EmbeddingsResponseItemSchema = array(number());
export const EmbeddingsResponseSchema = array(EmbeddingsResponseItemSchema);

export type EmbeddingsResponseItem = Output<typeof EmbeddingsResponseItemSchema>;
export type EmbeddingsResponse = Output<typeof EmbeddingsResponseSchema>;
