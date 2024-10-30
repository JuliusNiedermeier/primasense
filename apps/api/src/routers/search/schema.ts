import { object, string } from 'valibot';

export const collectionIdQueryParam = 'collection';

export const SearchRouterQuerySchema = object({ [collectionIdQueryParam]: string() });
