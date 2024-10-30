import { Output, minLength, object, parse, string } from 'valibot';
import { db } from '../../../database/client.js';
import { Collection, CollectionSelectSchema, CollectionUser } from '../../../database/schema/index.js';
import { createSlug, generateApiKey } from '../../../database/schema/utils.js';
import { RequestHandler } from 'express';

export const CreateOneCollectionBodySchema = object({ name: string([minLength(3)]) });
export const CreateOneCollectionResponseSchema = CollectionSelectSchema;
export type CreateOneCollectionBody = Output<typeof CreateOneCollectionBodySchema>;
export type CreateOneCollectionResponse = Output<typeof CreateOneCollectionResponseSchema>;

export const createOneCollection: RequestHandler<{}, CreateOneCollectionResponse, CreateOneCollectionBody, {}> = async (req, res, next) => {
  try {
    const { name } = parse(CreateOneCollectionBodySchema, req.body);
    const [collection] = await db
      .insert(Collection)
      .values({ id: createSlug(name), name, apiKey: generateApiKey() })
      .returning();
    await db.insert(CollectionUser).values({ collectionId: collection.id, userId: req.auth.user.userId, role: 'owner' }).returning();
    const response = parse(CreateOneCollectionResponseSchema, collection);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
