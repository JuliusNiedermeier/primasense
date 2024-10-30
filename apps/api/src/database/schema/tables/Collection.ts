import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { Video } from './Video.js';
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import { CollectionUser } from './CollectionUser.js';

export const Collection = pgTable('collection', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  apiKey: text('api_key').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id'),
});

export const collectionRelations = relations(Collection, ({ many }) => ({
  videos: many(Video),
  users: many(CollectionUser),
}));

export type CollectionInsert = typeof Collection.$inferInsert;
export type CollectionSelect = typeof Collection.$inferSelect;

export const CollectionInsertSchema = createInsertSchema(Collection);
export const CollectionSelectSchema = createSelectSchema(Collection);
