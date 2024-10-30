import { RequestHandler, type Request } from 'express';
import { rateLimit } from './middleware/rate-limit.js';
import { Ratelimit } from '@upstash/ratelimit';

export const cleanRouteString = (route: string) =>
  route
    .split('/')
    .map((segment) => (segment.startsWith(':') ? `{${segment.slice(1)}}` : segment))
    .join('/');

export const baseRateLimitIdentifier = (req: Request) => `${req.method}:${cleanRouteString(req.route.path)}`;

export const userBasedRateLimitIdentifier = (req: Request) => `${baseRateLimitIdentifier(req)}:${req.auth.user.userId}`;
export const collectionBasedRateLimitIdentifier = (req: Request) => `${baseRateLimitIdentifier(req)}:${req.params.collectionId}`;

export const defaultUserBasedRateLimiter: RequestHandler = rateLimit({
  prefix: 'user-60-1m',
  identifier: (req) => `${userBasedRateLimitIdentifier}:${req.auth.user.userId}`,
  limiter: Ratelimit.slidingWindow(60, '1m'),
});

export const defaultCollectionBasedRateLimiter: RequestHandler = rateLimit({
  prefix: 'collection-60-1m',
  identifier: (req) => `${collectionBasedRateLimitIdentifier}:${req.params.collectionId}`,
  limiter: Ratelimit.slidingWindow(60, '1m'),
});
