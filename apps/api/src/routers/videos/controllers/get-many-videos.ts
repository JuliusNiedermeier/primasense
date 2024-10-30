import { RequestHandler } from 'express';
import { db } from '../../../database/client.js';
import { Video, VideoSelectSchema } from '../../../database/schema/index.js';
import { eq } from 'drizzle-orm';
import { Output, array, parse } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { VideosRouterQuerySchema, collectionIdQueryParam } from '../schema.js';

export const GetManyVideosQuerySchema = VideosRouterQuerySchema;
export const GetManyVideosResponseSchema = array(VideoSelectSchema);

export type GetManyVideosQuery = Output<typeof GetManyVideosQuerySchema>;
export type GetManyVideosResponse = Output<typeof GetManyVideosResponseSchema>;

export const getManyVideos: RequestHandler<GetManyVideosQuery, GetManyVideosResponse, {}, {}> = async (req, res, next) => {
  try {
    const { [collectionIdQueryParam]: collectionId } = parse(GetManyVideosQuerySchema, req.query);
    if (!req.auth.permissions.find((permission) => permission.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied.');
    const videos = await db.select().from(Video).where(eq(Video.collectionId, collectionId));
    const response = parse(GetManyVideosResponseSchema, videos);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
