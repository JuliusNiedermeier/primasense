export type EmbeddingsClient = ReturnType<typeof createEmbeddingsClient>;

type EmbeddingsClientConfig = {
  apiKey: string;
};

export const createEmbeddingsClient = (config: EmbeddingsClientConfig) => {
  return { baseURL: 'http://127.0.0.1:8000', ...config };
};
