import type { Config } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';

loadEnvConfig(cwd());

export default {
  schema: './src/core/ressources/schema.drizzle.ts',
  out: './drizzle',
  driver: 'pg',
  introspect: { casing: 'preserve' },
  dbCredentials: {
    connectionString: process.env.NEON_POSTGRES_CONNECTION_STRING!,
  },
} satisfies Config;
