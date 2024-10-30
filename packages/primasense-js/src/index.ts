export * from './endpoints/checkout-sessions.js';
export * from './endpoints/collections.js';
export * from './endpoints/customer-portal-sessions.js';
export * from './endpoints/videos.js';
export * from './endpoints/search.js';

export type PrimasenseClient = ReturnType<typeof createPrimasenseClient>;

type PrimasenseClientConfig = {
  apiKey?: string;
  getJwt?: () => string | null | Promise<string | null>;
};

const createFetchWrapper = (config: PrimasenseClientConfig) => {
  return async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
    const response = await fetch(input, { ...init, headers: { ...init?.headers, authorization: config.apiKey || `Bearer ${config.getJwt && (await config.getJwt())}` } });
    const data = await response.json();
    if (!response.ok) throw data;
    return data as T;
  };
};

export const createPrimasenseClient = (config: PrimasenseClientConfig) => ({ baseURL: 'http://localhost:4000', fetch: createFetchWrapper(config) });

type SafelySuccess<T> = {
  success: true;
  data: T;
  error: null;
};

type SafelyError = {
  success: false;
  data: null;
  error: unknown;
};

export const safely = async <T>(promise: Promise<T>): Promise<SafelySuccess<Awaited<T>> | SafelyError> => {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (error) {
    return { data: null, error, success: false };
  }
};
