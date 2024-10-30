import { createCoreAction } from '@/core/core-action';
import { CoreActionError } from '@/core/core-action-error';
import { drizzle } from '@/core/services/drizzle';
import { z } from 'zod';
import { Video } from '../../schema';
import { createSlug } from '@/core/db-utils';
import { createUploadSession } from './utils/upload-session';

const configSchema = z.object({ collectionID: z.string(), title: z.string() });

export const createVideo = createCoreAction({ actionID: 'create-video', configSchema, rateLimitIdentifier: ({ config }) => config.collectionID }, async (auth, config) => {
  if (!(await auth.hasCollectionAccess([config.collectionID]))) throw new CoreActionError('permission-denied', 'Access denied');

  const [video] = await drizzle
    .insert(Video)
    .values({ id: createSlug(config.title), collectionId: config.collectionID, title: config.title, status: 'awaiting-upload' })
    .returning();

  const uploadSessionID = await createUploadSession(video.id);

  return { video, uploadSessionID };
});
