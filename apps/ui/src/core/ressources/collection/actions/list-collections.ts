import { drizzle } from '@/core/services/drizzle';
import { Collection } from '../schema';
import { eq } from 'drizzle-orm';
import { createCoreAction } from '@/core/core-action';
import { z } from 'zod';
import { CoreActionError } from '@/core/core-action-error';

const configSchema = z.object({});

export const listCollections = createCoreAction(
  { actionID: 'list-collections', configSchema, requireUser: true, rateLimitIdentifier: ({ auth }) => auth.user?.id || '' },
  async (auth) => {
    if (!auth.user) throw new CoreActionError('permission-denied', 'This action can only be called by a user');
    return drizzle.select().from(Collection).where(eq(Collection.userId, auth.user.id)).orderBy(Collection.createdAt);
  },
);
