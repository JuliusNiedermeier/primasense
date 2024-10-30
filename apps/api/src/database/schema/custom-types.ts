import { customType } from 'drizzle-orm/pg-core';

export const realArray = customType<{ data: number[] }>({ dataType: () => 'real[]' });
