import { object, string } from 'valibot';

export const videoIdParam = 'videoId';
export const collectionIdQueryParam = 'collection';

export const VideosRouterQuerySchema = object({ [collectionIdQueryParam]: string() });
export const VideosRouterParamsSchema = object({ [videoIdParam]: string() });
