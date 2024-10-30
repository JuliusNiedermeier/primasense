import { eq } from 'drizzle-orm';
import { db } from '../../../database/client.js';
import { Collection, CollectionSelectSchema } from '../../../database/schema/index.js';
import { RequestHandler } from 'express';
import { type Output, parse } from 'valibot';
import { generateApiKey } from '../../../database/schema/utils.js';
import { APIError } from '../../../middleware/error.js';
import { CollectionsRouterParamsSchema, collectionIdParam } from '../schema.js';

const RegenerateApiKeyParamsSchema = CollectionsRouterParamsSchema;
const RegenerateApiKeyResponseSchema = CollectionSelectSchema;

export type RegenerateApiKeyResponse = Output<typeof RegenerateApiKeyResponseSchema>;
export type RegenerateApiKeyParams = Output<typeof RegenerateApiKeyParamsSchema>;

export const regenerateApiKey: RequestHandler<RegenerateApiKeyParams, RegenerateApiKeyResponse, {}, {}> = async (req, res, next) => {
  try {
    const { [collectionIdParam]: collectionId } = parse(RegenerateApiKeyParamsSchema, req.params);
    if (!req.auth.permissions.find((permission) => permission.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied.');
    const [collection] = await db.update(Collection).set({ apiKey: generateApiKey() }).where(eq(Collection.id, collectionId)).returning();
    const response = parse(RegenerateApiKeyResponseSchema, collection);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
