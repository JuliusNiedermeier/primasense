import type { PrimasenseClient } from '../index.js';
import type { CreateCustomerPortalSessionBody, CreateCustomerPortalSessionResponse } from '@primasense/api';

const endpoint = 'customer-portal-sessions';

export const createOneCustomerPortalSession = async (client: PrimasenseClient, data: CreateCustomerPortalSessionBody) => {
  return client.fetch<CreateCustomerPortalSessionResponse>([client.baseURL, endpoint].join('/'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  });
};
