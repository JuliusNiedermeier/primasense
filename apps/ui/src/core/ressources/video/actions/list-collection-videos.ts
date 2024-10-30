import { CoreActionError } from '@/core/core-action-error';
import { drizzle } from '@/core/services/drizzle';
import { z } from 'zod';
import { Video } from '../schema';
import { eq } from 'drizzle-orm';
import { createCoreAction } from '@/core/core-action';

const configSchema = z.object({ collectionId: z.string() });

export const listCollectionVideos = createCoreAction(
  { actionID: 'list-collection-videos', configSchema, rateLimitIdentifier: ({ config }) => config.collectionId },
  async (auth, config) => {
    if (!(await auth.hasCollectionAccess([config.collectionId]))) throw new CoreActionError('permission-denied', 'Permission denied to list videos of this collection.');
    const videos = await drizzle.select().from(Video).where(eq(Video.collectionId, config.collectionId));
    return videos;
  },
);
