import { drizzle } from '@/core/services/drizzle';
import { Collection } from '../schema';
import { eq } from 'drizzle-orm';
import { CoreActionError } from '@/core/core-action-error';
import { createCoreAction } from '@/core/core-action';
import { z } from 'zod';

const configSchema = z.object({ id: z.string() });

export const getCollection = createCoreAction(
  { actionID: 'get-collection', configSchema, requireUser: true, rateLimitIdentifier: ({ auth }) => auth.user?.id || '' },
  async (auth, config) => {
    if (!(await auth.hasCollectionAccess([config.id]))) throw new CoreActionError('permission-denied', 'Permission denied to retrieve this collection.');
    const [collection] = await drizzle.select().from(Collection).where(eq(Collection.id, config.id)).limit(1);
    return collection;
  },
);
