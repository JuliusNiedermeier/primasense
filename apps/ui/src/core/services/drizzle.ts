import { drizzle as createDrizzle } from 'drizzle-orm/neon-http';
import { neon } from '@/core/services/neon-postgres';

import * as schema from '@/core/ressources/schema.drizzle';

export const drizzle = createDrizzle(neon, { schema });
