import { eq } from 'drizzle-orm';
import { db } from '../../../database/client.js';
import { Collection, CollectionSelectSchema } from '../../../database/schema/index.js';
import { RequestHandler } from 'express';
import { type Output, parse } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { CollectionsRouterParamsSchema, collectionIdParam } from '../schema.js';

export const GetOneCollectionParamsSchema = CollectionsRouterParamsSchema;
export const GetOneCollectionResponseSchema = CollectionSelectSchema;
export type GetOneCollectionParams = Output<typeof GetOneCollectionParamsSchema>;
export type GetOneCollectionResponse = Output<typeof GetOneCollectionResponseSchema>;

export const getOneCollection: RequestHandler<GetOneCollectionParams, {}, GetOneCollectionResponse, {}> = async (req, res, next) => {
  try {
    const { [collectionIdParam]: collectionId } = parse(GetOneCollectionParamsSchema, req.params);
    if (!req.auth.permissions.find((permission) => permission.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied.');
    const [collection] = await db.select().from(Collection).where(eq(Collection.id, collectionId));
    if (!collection) throw new APIError('not-found', `No collection with id '${collectionId}'`);
    const response = parse(GetOneCollectionResponseSchema, collection);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
