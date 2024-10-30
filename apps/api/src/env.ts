import { object, parse, string } from 'valibot';
import 'dotenv/config';

const EnvSchema = object({
  NEON_CONNECTION_STRING: string(),
  CLERK_API_KEY: string(),
  CLERK_SECRET_KEY: string(),
  CLERK_PUBLISHABLE_KEY: string(),
  STRIPE_SECRET_KEY: string(),
  STRIPE_PRICE_ID: string(),
  UPSTASH_REDIS_URL: string(),
  UPSTASH_REDIS_TOKEN: string(),
});

export const env = parse(EnvSchema, process.env);
