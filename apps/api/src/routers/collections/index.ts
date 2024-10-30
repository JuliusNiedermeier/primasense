import { Router } from 'express';
import { defaultCollectionBasedRateLimiter, defaultUserBasedRateLimiter } from '../../utils.js';
import { createOneCollection } from './controllers/create-one-collection.js';
import { getManyCollections } from './controllers/get-many-collections.js';
import { deleteOneCollection } from './controllers/delete-one-collection.js';
import { getOneCollection } from './controllers/get-one-collection.js';
import { updateOneCollection } from './controllers/update-one-collection.js';
import { collectionIdParam } from './schema.js';
import { regenerateApiKey } from './controllers/regenerate-api-key.js';

export const collectionsRouter: Router = Router();

collectionsRouter.get('/', defaultUserBasedRateLimiter, getManyCollections);
collectionsRouter.post('/', defaultUserBasedRateLimiter, createOneCollection);
collectionsRouter.get(`/:${collectionIdParam}`, defaultCollectionBasedRateLimiter, getOneCollection);
collectionsRouter.patch(`/:${collectionIdParam}`, defaultCollectionBasedRateLimiter, updateOneCollection);
collectionsRouter.delete(`/:${collectionIdParam}`, defaultCollectionBasedRateLimiter, deleteOneCollection);
collectionsRouter.put(`/:${collectionIdParam}/api-keys`, defaultCollectionBasedRateLimiter, regenerateApiKey);
