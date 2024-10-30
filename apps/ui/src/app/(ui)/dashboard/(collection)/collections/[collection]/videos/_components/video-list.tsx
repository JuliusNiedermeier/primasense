import { FC, Suspense } from 'react';
import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { Skeleton } from '@/app/(ui)/_components/ui/skeleton';
import { listCollectionVideos } from '@/core/ressources/video/actions/list-collection-videos';
import { Badge } from '@/app/(ui)/_components/ui/badge';
import { VideoUploadResumer } from './video-upload-resumer';

const gridClassName = 'grid gap-4';

type VideoListProps = {
  collectionId: string;
};

export const VideoList: FC<VideoListProps> = ({ collectionId }) => {
  return (
    <Suspense
      fallback={
        <div className={gridClassName}>
          {Array.from(new Array(3)).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      }
    >
      <_VideoList collectionId={collectionId} />
    </Suspense>
  );
};

export const _VideoList: FC<VideoListProps> = async ({ collectionId }) => {
  const auth = await createServerAuthContext();
  const videos = await listCollectionVideos(auth, { collectionId });

  const resumableVideoIDs = videos.filter((video) => video.status === 'awaiting-upload').map((video) => video.id);

  if (!videos.length)
    return (
      <div className="rounded border relative overflow-hidden">
        <div className="rounded border p-4 grid gap-2">
          {Array.from(new Array(10)).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-background" />
      </div>
    );

  return (
    <>
      <VideoUploadResumer resumableVideoIDs={resumableVideoIDs} />
      <div className={gridClassName}>
        {videos.map((video) => (
          <div key={video.id} className="rounded border p-4">
            <span className="font-medium">{video.id}</span>
            <Badge>{video.status}</Badge>
          </div>
        ))}
      </div>
    </>
  );
};
