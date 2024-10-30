import { inArray } from 'drizzle-orm';
import { db } from '../../../database/client.js';
import { Collection, CollectionSelectSchema } from '../../../database/schema/index.js';
import { RequestHandler } from 'express';
import { type Output, array, parse } from 'valibot';

export const GetManyCollectionsResponseSchema = array(CollectionSelectSchema);
export type GetManyColectionsResponse = Output<typeof GetManyCollectionsResponseSchema>;

export const getManyCollections: RequestHandler<{}, {}, GetManyColectionsResponse, {}> = async (req, res, next) => {
  try {
    // Access control
    const allowedCollections = req.auth.permissions.map((permission) => permission.collection);
    if (!allowedCollections.length) return res.status(200).json(parse(GetManyCollectionsResponseSchema, []));

    // Actual task
    const collections = await db.select().from(Collection).where(inArray(Collection.id, allowedCollections));
    const response = parse(GetManyCollectionsResponseSchema, collections);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
