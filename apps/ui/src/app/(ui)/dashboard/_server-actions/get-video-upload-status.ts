'use server';

import { createServerAuthContext } from '../../_utils/create-server-auth-context';
import { getVideoUploadStatus as _getVideoUploadStatus } from '@/core/ressources/video/actions/video-upload/get-video-upload-status';

export const getVideoUploadStatus = async (videoId: string) => {
  const auth = await createServerAuthContext();
  return await _getVideoUploadStatus(auth, { videoId });
};
