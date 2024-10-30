import type { PrimasenseClient } from '../index.js';
import type {
  GetManyColectionsResponse,
  GetOneCollectionResponse,
  CreateOneCollectionBody,
  CreateOneCollectionResponse,
  UpdateOneCollectionBody,
  UpdateOneCollectionResponse,
  RegenerateApiKeyResponse,
  DeleteOneCollectionResponse,
} from '@primasense/api';

const endpoint = 'collections';

export const getManyCollections = async (client: PrimasenseClient) => {
  return client.fetch<GetManyColectionsResponse>([client.baseURL, endpoint].join('/'));
};

export const getOneCollection = async (client: PrimasenseClient, id: string) => {
  return client.fetch<GetOneCollectionResponse>([client.baseURL, endpoint, id].join('/'));
};

export const createOneCollection = async (client: PrimasenseClient, data: CreateOneCollectionBody) => {
  return client.fetch<CreateOneCollectionResponse>([client.baseURL, endpoint].join('/'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const deleteOneCollection = async (client: PrimasenseClient, id: string) => {
  return client.fetch<DeleteOneCollectionResponse>([client.baseURL, endpoint, id].join('/'), { method: 'DELETE' });
};

export const updateOneCollection = async (client: PrimasenseClient, id: string, data: UpdateOneCollectionBody) => {
  return client.fetch<UpdateOneCollectionResponse>([client.baseURL, endpoint, id].join('/'), {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const regenerateApiKey = async (client: PrimasenseClient, collectionId: string) => {
  return client.fetch<RegenerateApiKeyResponse>([client.baseURL, endpoint, collectionId, 'api-keys'].join('/'), { method: 'PUT' });
};
