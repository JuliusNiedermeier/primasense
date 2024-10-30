import { createApiAuthContext } from '@/app/api/v1/_utils/create-api-auth-context';
import { listCollectionVideos } from '@/core/ressources/video/actions/list-collection-videos';
import { withRouteErrorHandling } from '@/app/api/v1/_utils/route-error';
import { createVideo } from '@/core/ressources/video/actions/video-upload/create-video';

export const GET = withRouteErrorHandling(async (request: Request) => {
  const collectionId = new URL(request.url).searchParams.get('collection') as string;
  const auth = await createApiAuthContext();
  const videos = await listCollectionVideos(auth, { collectionId });
  return Response.json(videos);
});

// Create video and resumable upload session
export const POST = withRouteErrorHandling(async (request: Request) => {
  const config = await request.json();
  const auth = await createApiAuthContext();
  const { video, uploadSessionID } = await createVideo(auth, config);
  return Response.json({ video, uploadID: uploadSessionID });
});
