import { RequestHandler } from 'express';
import { Frame, Video } from '../../../database/schema/index.js';
import { db } from '../../../database/client.js';
import { eq } from 'drizzle-orm';
import { Output, number, object, parse } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { VideosRouterParamsSchema, videoIdParam } from '../schema.js';

export const DeleteOneVideoParamsSchema = VideosRouterParamsSchema;
export const DeleteOneVideoResponseSchema = object({ id: number() });

export type DeleteOneVideoParams = Output<typeof DeleteOneVideoParamsSchema>;
export type DeleteOneVideoResponse = Output<typeof DeleteOneVideoResponseSchema>;

export const deleteOneVideo: RequestHandler<DeleteOneVideoParams, {}, {}, {}> = async (req, res, next) => {
  try {
    const { [videoIdParam]: videoId } = parse(DeleteOneVideoParamsSchema, req.params);
    const parsedVideoId = parse(number(), parseInt(videoId));
    const [video] = await db.select().from(Video).where(eq(Video.id, parsedVideoId)).limit(1);
    if (!video) throw new APIError('not-found', 'Video not found.');
    if (!req.auth.permissions.find((permission) => permission.collection === video.collectionId)) throw new APIError('permission-denied', 'Permission denied.');
    await db.delete(Video).where(eq(Video.id, parsedVideoId));
    await db.delete(Frame).where(eq(Frame.videoId, parsedVideoId));
    const response = parse(DeleteOneVideoResponseSchema, { id: parsedVideoId });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
