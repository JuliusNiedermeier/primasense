import { drizzle } from '@/core/services/drizzle';
import { Collection, CollectionIsertSchema } from '@/core/ressources/collection/schema';
import { createSlug } from '@/core/db-utils';
import { generateApiKey } from '@/core/ressources/collection/utils/generate-api-key';
import { createCoreAction } from '@/core/core-action';
import { CoreActionError } from '@/core/core-action-error';

const configSchema = CollectionIsertSchema.omit({ apiKey: true, userId: true }).partial({ id: true }).strip();

export const createCollection = createCoreAction(
  { actionID: 'create-collection', requireUser: true, configSchema, rateLimitIdentifier: ({ auth }) => auth.user?.id || '' },
  async (auth, config) => {
    if (!auth.user) throw new CoreActionError('permission-denied', 'This action can only be called by a user');
    const [collection] = await drizzle
      .insert(Collection)
      .values({
        id: config.id || createSlug(config.name),
        name: config.name,
        apiKey: generateApiKey(),
        userId: auth.user.id,
      })
      .returning();

    return collection;
  },
);
