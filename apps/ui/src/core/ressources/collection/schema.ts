import { createdAt } from '@/core/db-utils';
import { zodKeys } from '@/utils/zod-keys';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const Collection = pgTable('collection', {
  createdAt,
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  apiKey: text('api_key').notNull(),
  // userId will be replaced by organizationId as soon as organizations are implmented.
  // Clerk has good support for organization management.
  userId: text('user_id').notNull(),
});

const InsertSchema = createInsertSchema(Collection);

export const CollectionIsertSchema = InsertSchema.omit({ createdAt: true }).extend({ [zodKeys(InsertSchema).name]: InsertSchema.shape.name.min(3) });
export const CollectionUpdateSchema = CollectionIsertSchema.omit({ id: true }).partial();
export const CollectionSelectSchema = createSelectSchema(Collection);

export type CollectionInsert = z.infer<typeof CollectionIsertSchema>;
export type CollectionUpdate = z.infer<typeof CollectionUpdateSchema>;
export type CollectionSelect = z.infer<typeof CollectionSelectSchema>;
