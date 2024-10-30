import { object, string } from 'valibot';

export const collectionIdParam = 'collectionId';

export const CollectionsRouterParamsSchema = object({ [collectionIdParam]: string() });
