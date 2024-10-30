import { createCoreAction } from '@/core/core-action';
import { CoreActionError } from '@/core/core-action-error';
import { z } from 'zod';
import { videoBucket } from '@/core/services/gcp-storage';
import { Readable } from 'stream';
import { getUploadSession } from './utils/upload-session';
import { drizzle } from '@/core/services/drizzle';
import { Video } from '../../schema';
import { eq } from 'drizzle-orm';

const configSchema = z.object({ uploadSessionID: z.string(), fileStream: z.instanceof(Readable) });

// Keep in mind this action is only authenticated using the uploadSessionID!

export const uploadVideo = createCoreAction({ actionID: 'upload-video', configSchema, rateLimitIdentifier: ({ config }) => config.uploadSessionID }, async (auth, config) => {
  const uploadSession = await getUploadSession({ uploadID: config.uploadSessionID });
  if (!uploadSession) throw new CoreActionError('not-found', 'The requested upload session was not found. Maybe it is expired.');

  const video = await drizzle.query.Video.findFirst({ where: eq(Video.id, uploadSession.videoID), columns: { collectionId: true } });
  if (!video) throw new CoreActionError('not-found', 'Video not found. It may have been deleted.');

  const uploadResult = await new Promise<{ complete: boolean; collectionID: string }>(async (resolve, reject) => {
    let uploadComplete = false;

    const file = videoBucket.file(uploadSession.videoID);
    const writeStream = file.createWriteStream({ uri: uploadSession.uploadURL });
    config.fileStream.pipe(writeStream);

    writeStream.addListener('finish', () => (uploadComplete = true));
    writeStream.addListener('close', () => resolve({ complete: uploadComplete, collectionID: video.collectionId }));
  });

  if (uploadResult.complete) {
    await drizzle.update(Video).set({ status: 'analyzing' }).where(eq(Video.id, uploadSession.videoID));
  }

  return uploadResult;
});
