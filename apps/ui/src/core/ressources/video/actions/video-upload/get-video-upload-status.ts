import { createCoreAction } from '@/core/core-action';
import { CoreActionError } from '@/core/core-action-error';
import { z } from 'zod';
import { drizzle } from '@/core/services/drizzle';
import { eq } from 'drizzle-orm';
import { Video } from '../../schema';
import { getUploadSession } from './utils/upload-session';

const configSchema = z.object({ videoId: z.string() });

const GCSStatusCompleteMap = { 201: true, 308: false };

export const getVideoUploadStatus = createCoreAction(
  { actionID: 'get-video-upload-status', configSchema, rateLimitIdentifier: ({ config }) => config.videoId },
  async (auth, config) => {
    const video = await drizzle.query.Video.findFirst({ where: eq(Video.id, config.videoId), columns: { collectionId: true } });
    if (!video) throw new CoreActionError('not-found', 'Video not found');
    if (!(await auth.hasCollectionAccess([video.collectionId]))) throw new CoreActionError('permission-denied', 'Access denied');

    const uploadSession = await getUploadSession({ videoID: config.videoId });
    // At this point a new upload session should be created instead of throwing an error.
    if (!uploadSession) throw new CoreActionError('not-found', 'Video upload expired');

    const response = await fetch(uploadSession.uploadURL, { method: 'PUT', headers: { 'Content-Length': '0', 'Content-Range': 'bytes */*' } });
    if (!Object.keys(GCSStatusCompleteMap).includes(response.status.toString())) throw new CoreActionError('internal', 'Unexpected GCS response status code');

    return {
      complete: GCSStatusCompleteMap[response.status as keyof typeof GCSStatusCompleteMap],
      recievedBytes: response.headers.get('Range') || 0,
      uploadID: uploadSession.uploadID,
    };
  },
);
