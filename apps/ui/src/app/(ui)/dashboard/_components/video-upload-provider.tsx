'use client';

import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';
import { getVideoUploadStatus } from '../_server-actions/get-video-upload-status';
import { createVideo } from '../(collection)/collections/[collection]/videos/_server-actions/create-video';
import { uploadFile } from '../utils/upload-file';
import { useRouter } from 'next/navigation';

type UploadConfig = {
  file: File;
  collectionID: string;
};

type ResumeUploadConfig = {
  videoID: string;
};

type VideoUploadContext = {
  upload: (config: UploadConfig) => void;
  resumeUpload: (config: ResumeUploadConfig) => void;
  uploads: Upload[];
};

type Upload = {
  tempID: string;
  progress: number;
  title: string;
  videoID?: string;
  status: 'creating-video' | 'interrupted' | 'preparing-upload' | 'uploading' | 'interrupted' | 'complete';
};

const VideoUploadContext = createContext<VideoUploadContext>({ upload: () => {}, resumeUpload: () => {}, uploads: [] });

export const useVideoUpload = () => {
  const videoUploadContext = useContext(VideoUploadContext);
  if (!videoUploadContext) throw new Error('Hook useVideoUpload must be used inside a VideoUploadProvider.');
  return videoUploadContext;
};

export const VideoUploadProvider: FC<PropsWithChildren> = ({ children }) => {
  const [uploads, setUploads] = useState<Upload[]>([]);

  const router = useRouter();

  const updateUpload = (tempID: string, update: Partial<Upload>) => {
    setUploads((uploads) => uploads.map((upload) => (upload.tempID === tempID ? { ...upload, ...update } : upload)));
  };

  const upload: VideoUploadContext['upload'] = async (config) => {
    const arr = new Uint32Array(5);
    crypto.getRandomValues(arr);
    const tempID = arr.join('');

    setUploads((uploads) => [...uploads, { tempID: tempID, title: config.file.name, status: 'creating-video', progress: 0 }]);

    const { video, uploadSessionID } = await createVideo(config.file.name, config.collectionID);

    updateUpload(tempID, { videoID: video.id, status: 'uploading' });

    const uploadSuccessful = await uploadFile({
      file: config.file,
      videoID: video.id,
      uploadID: uploadSessionID,
      onProgress: (progress) => setUploads((uploads) => uploads.map((upload) => (upload.tempID === tempID ? { ...upload, progress } : upload))),
    });

    updateUpload(tempID, { status: uploadSuccessful ? 'complete' : 'interrupted' });
    router.refresh();
  };

  const resumeUpload: VideoUploadContext['resumeUpload'] = async (config) => {
    if (uploads.find((upload) => upload.videoID === config.videoID)) return;
    setUploads((uploads) => [...uploads, { tempID: config.videoID, videoID: config.videoID, progress: 0, status: 'interrupted', title: config.videoID }]);
  };

  return <VideoUploadContext.Provider value={{ upload, resumeUpload, uploads }}>{children}</VideoUploadContext.Provider>;
};

// const uploadStatus = await getVideoUploadStatus(config.videoID);
