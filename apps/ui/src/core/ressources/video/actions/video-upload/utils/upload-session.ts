import { CoreActionError } from '@/core/core-action-error';
import { videoBucket } from '@/core/services/gcp-storage';
import { redis } from '@/core/services/upstash-redis';
import { z } from 'zod';

const UploadSessionSchema = z.object({ videoID: z.string().min(1), uploadID: z.string().min(1), uploadURL: z.string().min(1) });

const createUploadSessionKey = (videoID: string, uploadID: string) => `upload-session:${videoID}:${uploadID}`;
const createUploadSessionKeyPattern = ({ videoID, uploadID }: { videoID?: string; uploadID?: string }) => createUploadSessionKey(videoID || '*', uploadID || '*');

const extractValuesFromUploadSessionKey = (key: string) => {
  const [_, videoID, uploadID] = key.split(':');
  return { videoID, uploadID };
};

export const createUploadSession = async (videoID: string) => {
  const file = videoBucket.file(videoID);
  const [uploadURL] = await file.createResumableUpload();
  const parsedUploadURL = new URL(uploadURL);
  const uploadID = parsedUploadURL.searchParams.get('upload_id');
  if (!uploadID) throw new CoreActionError('internal', 'No upload id found on gcp response.');

  const sessionExpiryDate = new Date();
  sessionExpiryDate.setDate(sessionExpiryDate.getDate() + 1);

  const uploadSessionKey = createUploadSessionKey(videoID, uploadID);
  await redis.set(uploadSessionKey, uploadURL);
  redis.expireat(uploadSessionKey, sessionExpiryDate.valueOf());

  return uploadID;
};

export const getUploadSession = async (options: { videoID?: string; uploadID?: string }) => {
  if (!options.videoID && !options.uploadID) return null;
  const [_, [uploadSessionKey]] = await redis.scan(0, { match: createUploadSessionKeyPattern(options), count: 1 });
  if (!uploadSessionKey) return null;
  const { videoID, uploadID } = extractValuesFromUploadSessionKey(uploadSessionKey);
  const uploadURL = await redis.get<string>(uploadSessionKey);
  if (!uploadURL) return null;
  return UploadSessionSchema.parse({ videoID, uploadID, uploadURL });
};
