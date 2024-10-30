'use client';

import { useVideoUpload } from '@/app/(ui)/dashboard/_components/video-upload-provider';
import { FC, useEffect } from 'react';

type Props = {
  resumableVideoIDs: string[];
};

export const VideoUploadResumer: FC<Props> = ({ resumableVideoIDs }) => {
  const { resumeUpload } = useVideoUpload();

  useEffect(() => {
    resumableVideoIDs.forEach((videoID) => resumeUpload({ videoID }));
  }, []);

  return null;
};
