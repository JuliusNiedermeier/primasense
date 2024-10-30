import { neon as createNeon, neonConfig } from '@neondatabase/serverless';
import { env } from '@/env';

neonConfig.fetchConnectionCache = true;

export const neon = createNeon(env.NEON_POSTGRES_CONNECTION_STRING);
