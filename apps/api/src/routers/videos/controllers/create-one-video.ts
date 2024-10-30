import { RequestHandler } from 'express';
import { FileArray } from 'express-fileupload';
import { Frame, Video, VideoSelectSchema } from '../../../database/schema/index.js';
import { db } from '../../../database/client.js';
import { embedVideo } from '@primasense/embeddings-js';
import { embeddings } from '../../../services/embeddings.js';
import { Output, parse } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { VideosRouterQuerySchema, collectionIdQueryParam } from '../schema.js';

export const CreateOneVideoQuerySchema = VideosRouterQuerySchema;
export const CreateOneVideoResponseSchema = VideoSelectSchema;

export type CreateOneVideoQuery = Output<typeof CreateOneVideoQuerySchema>;
export type CreateOneVideoResponse = Output<typeof CreateOneVideoResponseSchema>;

export const createOneVideo: RequestHandler<{}, CreateOneVideoResponse, {}, CreateOneVideoQuery> = async (req, res, next) => {
  try {
    const { [collectionIdQueryParam]: collectionId } = parse(CreateOneVideoQuerySchema, req.query);
    if (!req.auth.permissions.find((permissions) => permissions.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied.');
    const files = req.files as FileArray | undefined;
    const fileFormField = files?.file;
    if (!fileFormField || Array.isArray(fileFormField)) throw new APIError('invalid-argument', 'Invalid form data');
    if (!fileFormField.size) throw new APIError('invalid-argument', 'File has no bytes');
    const [video] = await db.insert(Video).values({ collectionId, durationInSeconds: 0 }).returning();

    const response = parse(CreateOneVideoResponseSchema, video);

    await embedVideo(embeddings, fileFormField.data, async (data) => {
      await db.insert(Frame).values({ videoId: video.id, description: 'No description', secondsFromStart: data.secondsFromStart, embedding: data.embedding });
      console.log('Inserted seconds from start', data.secondsFromStart);
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
