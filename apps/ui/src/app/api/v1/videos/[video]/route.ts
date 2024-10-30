import { createApiAuthContext } from '@/app/api/v1/_utils/create-api-auth-context';
import { RouteError, withRouteErrorHandling } from '@/app/api/v1/_utils/route-error';
import { uploadVideo } from '@/core/ressources/video/actions/video-upload/upload-video';
import { revalidatePath } from 'next/cache';
import { Readable } from 'stream';
import { type ReadableStream } from 'stream/web';

// Upload video or resume upload
export const PUT = withRouteErrorHandling(async (request: Request) => {
  const uploadSessionID = new URL(request.url).searchParams.get('uploadID');
  if (!uploadSessionID) throw new RouteError('invalid-arguments', 'uploadID must be provided as search parameter');
  if (!request.body) throw new RouteError('invalid-arguments', 'Request body must be a binary');

  const fileStream = Readable.fromWeb(request.body as ReadableStream);
  const auth = await createApiAuthContext();
  const uploadResult = await uploadVideo(auth, { uploadSessionID, fileStream });

  if (uploadResult.complete) revalidatePath(`/dashboard/collections/${uploadResult.collectionID}/videos`);

  return new Response(null);
});
