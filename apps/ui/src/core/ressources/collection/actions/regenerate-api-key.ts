import { drizzle } from '@/core/services/drizzle';
import { Collection } from '@/core/ressources/collection/schema';
import { z } from 'zod';
import { CoreActionError } from '@/core/core-action-error';
import { generateApiKey } from '../utils/generate-api-key';
import { eq } from 'drizzle-orm';
import { createCoreAction } from '@/core/core-action';

const configSchema = z.object({ collectionId: z.string() });

export const regenerateApiKey = createCoreAction(
  { actionID: 'regenerate-api-key', configSchema, requireUser: true, rateLimitIdentifier: ({ auth }) => auth.user?.id || '' },
  async (auth, config) => {
    if (!(await auth.hasCollectionAccess([config.collectionId]))) throw new CoreActionError('permission-denied', 'Permission denied.');
    await drizzle.update(Collection).set({ apiKey: generateApiKey() }).where(eq(Collection.id, config.collectionId));
    return true;
  },
);
