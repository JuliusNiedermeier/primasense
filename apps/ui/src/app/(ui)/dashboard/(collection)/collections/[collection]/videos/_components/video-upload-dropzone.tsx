'use client';

import { cn } from '@/app/(ui)/_utils/cn';
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { createVideo } from '../_server-actions/create-video';
import { Progress } from '@/app/(ui)/_components/ui/progress';
import { useRouter } from 'next/navigation';
import { uploadFile } from '../_utils/upload-file';
import { useVideoUpload } from '@/app/(ui)/dashboard/_components/video-upload-provider';

type Props = {
  collectionID: string;
};

export const VideoUploadDropzone: FC<PropsWithChildren<Props>> = ({ children, collectionID }) => {
  const router = useRouter();
  const videoUpload = useVideoUpload();
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback<Required<DropzoneOptions>['onDrop']>(
    async (acceptedFiles) => {
      // const fileBuffers = await Promise.all(acceptedFiles.map((file) => file.arrayBuffer()));
      acceptedFiles.forEach(async (file) => {
        // const { video, uploadSessionID } = await createVideo(file.name, collectionID);

        videoUpload.upload({ file, collectionID });
      });
      // const file = acceptedFiles[0];
      // if (!file) return;
      // const { video, uploadSessionID } = await createVideo(file.name, collectionID);
      // const success = await uploadFile({ videoID: video.id, uploadID: uploadSessionID, file, onProgress: setProgress });
      // router.refresh();
      // setProgress(0);
    },
    [collectionID, router],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, accept: { 'video/mp4': [] } });

  return (
    <div {...getRootProps()} className="relative">
      {/* <Progress value={progress * 100} className="mb-8" /> */}
      <input {...getInputProps()} />
      {children}
      <div
        className={cn('absolute top-0 bottom-0 left-0 right-0 bg-background/50 grid place-content-center opacity-0 transition-opacity pointer-events-none', {
          'opacity-100 pointer-events-all': isDragActive,
        })}
      >
        Drop files here
      </div>
    </div>
  );
};
