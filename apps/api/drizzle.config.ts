import type { Config } from 'drizzle-kit';
import { config as env } from 'dotenv';
env({ path: '.env' });

export default {
  schema: './dist/database/schema/index.js',
  out: './drizzle',
  driver: 'pg',
  introspect: { casing: 'preserve' },
  dbCredentials: {
    connectionString: process.env.NEON_CONNECTION_STRING!,
  },
} satisfies Config;
