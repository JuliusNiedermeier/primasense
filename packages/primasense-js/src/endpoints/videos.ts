import type { PrimasenseClient } from '../index.js';
import type { CreateOneVideoResponse, DeleteOneVideoResponse, GetManyVideosResponse } from '@primasense/api';

const endpoint = 'videos';

export const getManyVideos = async (client: PrimasenseClient, collection: string) => {
  const url = new URL([client.baseURL, endpoint].join('/'));
  url.searchParams.append('collection', collection);
  return client.fetch<GetManyVideosResponse>(url);
};

export const createOneVideo = async (client: PrimasenseClient, collection: string, file: File) => {
  const url = new URL([client.baseURL, endpoint].join('/'));
  url.searchParams.append('collection', collection);

  const formData = new FormData();
  formData.append('file', file);

  return client.fetch<CreateOneVideoResponse>(url, { method: 'POST', body: formData });
};

export const deleteOneVideo = async (client: PrimasenseClient, id: number) => {
  return client.fetch<DeleteOneVideoResponse>([client.baseURL, endpoint, id].join('/'), { method: 'DELETE' });
};
