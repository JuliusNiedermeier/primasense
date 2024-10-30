import { RequestHandler } from 'express';
import { Output, omit, parse, partial, strip } from 'valibot';
import { Collection, CollectionInsertSchema, CollectionSelectSchema } from '../../../database/schema/index.js';
import { db } from '../../../database/client.js';
import { eq } from 'drizzle-orm';
import { APIError } from '../../../middleware/error.js';
import { CollectionsRouterParamsSchema, collectionIdParam } from '../schema.js';

export const UpdateOneCollectionParamsSchema = CollectionsRouterParamsSchema;
export const UpdateOneCollectionBodySchema = partial(strip(omit(CollectionInsertSchema, ['id', 'apiKey'])));
export const UpdateOneCollectionResponseSchema = CollectionSelectSchema;
export type UpdateOneCollectionParams = Output<typeof UpdateOneCollectionParamsSchema>;
export type UpdateOneCollectionBody = Output<typeof UpdateOneCollectionBodySchema>;
export type UpdateOneCollectionResponse = Output<typeof UpdateOneCollectionResponseSchema>;

export const updateOneCollection: RequestHandler<UpdateOneCollectionParams, UpdateOneCollectionResponse, UpdateOneCollectionBody, {}> = async (req, res, next) => {
  try {
    const { [collectionIdParam]: collectionId } = parse(UpdateOneCollectionParamsSchema, req.params);
    if (!req.auth.permissions.find((permission) => permission.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied.');
    const update = parse(UpdateOneCollectionBodySchema, req.body);
    const [collection] = await db.update(Collection).set(update).where(eq(Collection.id, collectionId)).returning();
    if (!collection) throw new APIError('not-found', `No collection with id '${collectionId}'`);
    const response = parse(UpdateOneCollectionResponseSchema, collection);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
