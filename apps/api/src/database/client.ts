import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '../env.js';
import * as schema from './schema/index.js';

neonConfig.fetchConnectionCache = true;

const sql = neon(env.NEON_CONNECTION_STRING);
export const db = drizzle(sql, { schema });
