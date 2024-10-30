import { object, string } from 'valibot';

export const checkoutSessionIdParam = 'sessionId';
export const collectionIdQueryParam = 'collection';

export const CheckoutSessionsRouterParamsSchema = object({ [checkoutSessionIdParam]: string() });
export const CheckoutSessionsRouterQuerySchema = object({ [collectionIdQueryParam]: string() });
