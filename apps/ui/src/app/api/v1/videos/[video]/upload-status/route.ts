import { getVideoUploadStatus } from '@/core/ressources/video/actions/video-upload/get-video-upload-status';
import { createApiAuthContext } from '@/app/api/v1/_utils/create-api-auth-context';
import { withRouteErrorHandling } from '@/app/api/v1/_utils/route-error';

export const GET = withRouteErrorHandling<{ video: string }>(async (request: Request, { video }) => {
  const auth = await createApiAuthContext();
  const status = await getVideoUploadStatus(auth, { videoId: video });
  return Response.json(status);
});
