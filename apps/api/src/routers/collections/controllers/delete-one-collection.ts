import { RequestHandler } from 'express';
import { db } from '../../../database/client.js';
import { Collection, CollectionUser, Frame, Video } from '../../../database/schema/index.js';
import { eq, inArray } from 'drizzle-orm';
import { Output, object, parse, string } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { CollectionsRouterParamsSchema, collectionIdParam } from '../schema.js';

export const DeleteOneCollectionParamsSchema = CollectionsRouterParamsSchema;
export const DeleteOneCollectionResponseSchema = object({ id: string() });
export type DeleteOneCollectionParams = Output<typeof DeleteOneCollectionParamsSchema>;
export type DeleteOneCollectionResponse = Output<typeof DeleteOneCollectionResponseSchema>;

export const deleteOneCollection: RequestHandler<DeleteOneCollectionParams, {}, {}, {}> = async (req, res, next) => {
  try {
    const { [collectionIdParam]: collectionId } = parse(DeleteOneCollectionParamsSchema, req.params);
    if (!req.auth.permissions.find((permission) => permission.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied');
    await db.delete(CollectionUser).where(eq(CollectionUser.collectionId, collectionId));
    await db.delete(Collection).where(eq(Collection.id, collectionId)).returning();
    const videos = await db.delete(Video).where(eq(Video.collectionId, collectionId)).returning();
    const deletedVideoIds = videos.map((video) => video.id);
    if (videos.length) await db.delete(Frame).where(inArray(Frame.videoId, deletedVideoIds));
    const response = parse(DeleteOneCollectionResponseSchema, { id: collectionId });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
