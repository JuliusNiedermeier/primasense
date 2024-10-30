import { Ratelimit, Algorithm } from '@upstash/ratelimit';
import { Request, RequestHandler } from 'express';
import { redis } from '../services/upstash-redis.js';
import { APIError } from './error.js';

// type RateLimitConfig = {
//   param?: string;
// };

// const ratelimit = new Ratelimit({ redis: redis, prefix: 'ratelimit', limiter: Ratelimit.slidingWindow(60, '1m') });

// const getIdentifier = (request: Request, collectionParam?: string) => {
//   if (collectionParam) return request.params[collectionParam];
//   return request.auth.user.userId;
// };

// export const rateLimit = (config?: RateLimitConfig): RequestHandler => {
//   const rateLimitMiddleware: RequestHandler = async (request, _, next) => {
//     try {
//       const identifier = getIdentifier(request, config.param);

//       if (!identifier) {
//         console.error('Rate limit configuration error: Failed to get identifier');
//         throw new APIError('internal', 'Internal');
//       }

//       const endpoint = (request.route.path as string)
//         .split('/')
//         .map((segment) => (segment.startsWith(':') ? `{${segment.slice(1)}}` : segment))
//         .join('/');

//       const ratelimitKey = `${request.method}:${endpoint}:${identifier}`;

//       const rate = await ratelimit.limit(ratelimitKey);
//       if (!rate.success) throw new APIError('too-many-requests', 'Too many requests. Try again later.');

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };

//   return rateLimitMiddleware;
// };

type RateLimitConfig = {
  prefix?: string;
  identifier: (req: Request) => string;
  limiter: Algorithm<unknown>;
};

export const rateLimit = (config: RateLimitConfig): RequestHandler => {
  const ratelimit = new Ratelimit({ redis: redis, prefix: config.prefix, limiter: config.limiter });

  const rateLimitMiddleware: RequestHandler = async (request, _, next) => {
    try {
      const identifier = config.identifier(request);
      const rate = await ratelimit.limit(identifier);
      if (!rate.success) throw new APIError('too-many-requests', 'Too many requests. Try again later.');
      next();
    } catch (error) {
      next(error);
    }
  };

  return rateLimitMiddleware;
};
