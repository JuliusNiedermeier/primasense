import { FC, PropsWithChildren } from 'react';
import { VideoUploadProvider } from './_components/video-upload-provider';

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return <VideoUploadProvider>{children}</VideoUploadProvider>;
};

export default DashboardLayout;
