import { EmbeddingsClient } from './client.js';
import { object, string, number, array, blob, merge, Output, parse } from 'valibot';

const WireFormatResponseItemSchema = object({
  frame: string(),
  secondsFromStart: number(),
  embedding: array(number()),
});

const EmbeddingsVideoResponseItemSchema = merge([WireFormatResponseItemSchema, object({ frame: blob() })]);

export type EmbeddingsVideoResponseItem = Output<typeof EmbeddingsVideoResponseItemSchema>;

const endpoint = 'video-embeddings';

export const embedVideo = async (client: EmbeddingsClient, video: Buffer, onFrame: (data: EmbeddingsVideoResponseItem) => void) => {
  const videoBlob = new Blob([video], { type: 'video/mp4' });
  const formData = new FormData();
  formData.append('file', videoBlob);
  const response = await fetch([client.baseURL, endpoint].join('/'), {
    method: 'POST',
    body: formData,
  });

  if (!response.body) return;

  const textDecoder = new TextDecoder('utf-8');
  const reader = response.body.getReader();

  let jsonBuffer = '';
  const FRAME_DELIMITIER = 'END_OF_FRAME';

  while (true) {
    const { value, done } = await reader.read();
    if (done || !value) break;

    const stringValue = textDecoder.decode(value);
    let currentStart = 0;

    while (true) {
      const nextSlice = stringValue.slice(currentStart);
      const indexOfNextEOF = nextSlice.indexOf(FRAME_DELIMITIER);

      if (indexOfNextEOF < 0) {
        jsonBuffer += nextSlice;
        break;
      }

      jsonBuffer += nextSlice.slice(0, indexOfNextEOF);
      const { frame, secondsFromStart, embedding } = parse(WireFormatResponseItemSchema, JSON.parse(jsonBuffer));
      const frameBuffer = Buffer.from(frame, 'base64');
      onFrame(parse(EmbeddingsVideoResponseItemSchema, { frame: new Blob([frameBuffer]), secondsFromStart, embedding }));
      jsonBuffer = '';
      currentStart = indexOfNextEOF + FRAME_DELIMITIER.length;
    }
  }
};
