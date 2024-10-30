type UploadFileConfig = {
  videoID: string;
  uploadID: string;
  file: File;
  onProgress?: (progress: number) => void;
};

export const uploadFile = (config: UploadFileConfig) => {
  const uploadEnpointURL = new URL(`http://localhost:3000/api/v1/videos/${config.videoID}`);
  uploadEnpointURL.searchParams.set('uploadID', config.uploadID);

  const xhr = new XMLHttpRequest();

  return new Promise<boolean>((resolve, reject) => {
    xhr.upload.addEventListener('progress', (event) => event.lengthComputable && config.onProgress && config.onProgress(event.loaded / event.total));
    xhr.addEventListener('loadend', () => resolve(xhr.readyState === 4 && xhr.status === 200));
    xhr.open('PUT', uploadEnpointURL, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.send(config.file);
  });
};
