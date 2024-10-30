import { drizzle } from '@/core/services/drizzle';
import { Collection } from '@/core/ressources/collection/schema';
import { z } from 'zod';
import { CoreActionError } from '@/core/core-action-error';
import { eq } from 'drizzle-orm';
import { createCoreAction } from '@/core/core-action';

export const configSchema = z.object({ collectionId: z.string() });

export const deleteCollection = createCoreAction(
  { actionID: 'delete-collection', configSchema, requireUser: true, rateLimitIdentifier: ({ auth }) => auth.user?.id || '' },
  async (auth, config) => {
    if (!(await auth.hasCollectionAccess([config.collectionId]))) throw new CoreActionError('permission-denied', 'Permission denied.');
    await drizzle.delete(Collection).where(eq(Collection.id, config.collectionId));
    return true;
  },
);
