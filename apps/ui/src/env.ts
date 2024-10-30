import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    CLERK_SECRET_KEY: z.string(),
    NEON_POSTGRES_CONNECTION_STRING: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_METERED_PRICE_ID: z.string(),
    UPSTASH_REDIS_URL: z.string(),
    UPSTASH_REDIS_TOKEN: z.string(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: { NEXT_PUBLIC_BASE_URL: z.string(), NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string() },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEON_POSTGRES_CONNECTION_STRING: process.env.NEON_POSTGRES_CONNECTION_STRING,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_METERED_PRICE_ID: process.env.STRIPE_METERED_PRICE_ID,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
    UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
  },
});
