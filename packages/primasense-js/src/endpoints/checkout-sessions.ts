import { CreateCheckoutSessionBody, CreateCheckoutSessionQuery, CreateCheckoutSessionResponse, GetCheckoutSessionParams, GetCheckoutSessionResponse } from '@primasense/api';
import { PrimasenseClient } from '../index.js';

type CreateOneCheckoutSessionConfig = Required<CreateCheckoutSessionBody & CreateCheckoutSessionQuery>;

const endpoint = 'checkout-sessions';

export const createOneCheckoutSession = async (client: PrimasenseClient, config: CreateOneCheckoutSessionConfig) => {
  const url = new URL([client.baseURL, endpoint].join('/'));
  url.searchParams.append('collection', config.collection);

  const bodyData: CreateCheckoutSessionBody = { successUrl: config.successUrl, cancelUrl: config.cancelUrl };

  return client.fetch<CreateCheckoutSessionResponse>(url, {
    method: 'POST',
    body: JSON.stringify(bodyData),
    headers: { 'content-type': 'application/json' },
  });
};

export const getOneCheckoutSession = async (client: PrimasenseClient, sessionId: string) => {
  return client.fetch<GetCheckoutSessionResponse>([client.baseURL, endpoint, sessionId].join('/'));
};
