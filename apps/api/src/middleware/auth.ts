import { ClerkExpressWithAuth, LooseAuthProp } from '@clerk/clerk-sdk-node';
import { RequestHandler } from 'express';
import { APIError } from './error.js';
import { db } from '../database/client.js';
import { Collection, CollectionUser, CollectionUserRole } from '../database/schema/index.js';
import { eq } from 'drizzle-orm';

/* 
  This middleware ensures requests are properly authenticated.
  Two methods are allowed: JWT and api-key authentication.
  The JWT strategy is selected if the authorization header starts with "Bearer ", otherwise api-key strategy is used.
  API key authentication is only allowed for collection specific routes, because an api key is directly tied to one collection.
*/

type AuthStrategy = 'api-key' | 'jwt';
type Permission = { collection: string; role: CollectionUserRole };

type AuthProperties = {
  strategy?: AuthStrategy;
  user?: LooseAuthProp['auth'];
  permissions: Permission[];
};

export type AuthRequestProp = { auth: AuthProperties };

type AuthOptions = {
  strategies: AuthStrategy[];
};

type CreateRequireAuthMiddleware = (options: AuthOptions) => RequestHandler;

export const requireAuth: CreateRequireAuthMiddleware = (options) => {
  const clerkMiddleware = ClerkExpressWithAuth();

  const authMiddleware: RequestHandler = async (req, res, next) => {
    req.auth = { permissions: [] };

    const authorization = req.headers.authorization;

    // No authorization present
    if (!authorization) return next(new APIError('unauthenticated', 'Required authorization header not found.'));

    // Select JWT authentication strategy
    if (authorization.startsWith('Bearer ')) {
      if (!options.strategies.includes('jwt')) return next(new APIError('invalid-argument', 'JWT authentication is not allowed for this endpoint.'));
      if (req.hostname !== 'localhost') return next(new APIError('permission-denied', 'Bearer authentication is only allowed for internal usage.'));

      return clerkMiddleware(req, res, async () => {
        req.auth = { strategy: 'jwt', permissions: [], user: req.auth as unknown as LooseAuthProp['auth'] };

        // If no userId, proceed with empty permissions
        if (!req.auth.user.userId) return next(new APIError('unauthenticated', 'Not a valid user.'));

        // Get collection permissions for userId
        const collectionUsers = await db.select().from(CollectionUser).where(eq(CollectionUser.userId, req.auth.user.userId));
        req.auth.permissions = collectionUsers.map((collectionUser) => ({ collection: collectionUser.collectionId, role: collectionUser.role }));
        return next();
      });
    }

    // Default to API key authentication strategy
    if (!options.strategies.includes('api-key')) return next(new APIError('invalid-argument', 'API key authentication is not allowed for this endpoint.'));
    const [collection] = await db.select().from(Collection).where(eq(Collection.apiKey, authorization)).limit(1);
    if (!collection) return next(new APIError('unauthenticated', 'Invalid API key.'));
    req.auth = { strategy: 'api-key', permissions: [{ collection: collection.id, role: 'owner' }] };
    return next();
  };

  return authMiddleware;
};

export const jwtOnlyAuth: RequestHandler = requireAuth({ strategies: ['jwt'] });
export const hybridAuth: RequestHandler = requireAuth({ strategies: ['jwt', 'api-key'] });
