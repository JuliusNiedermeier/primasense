import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { Collection } from './Collection.js';

export const CollectionUserRole = pgEnum('collection_user_role', ['owner', 'editor', 'viewer']);

export const CollectionUser = pgTable('collection_user', {
  collectionId: text('collection_id').notNull(),
  userId: text('user_id').notNull(),
  role: CollectionUserRole('role'),
});

export const collectionUserRelations = relations(CollectionUser, ({ one }) => ({
  collection: one(Collection, { fields: [CollectionUser.collectionId], references: [Collection.id] }),
}));

export type CollectionUserRole = (typeof CollectionUserRole.enumValues)[number];
export type CollectionUserInsert = typeof CollectionUser.$inferSelect;
export type CollectionUserSelect = typeof CollectionUser.$inferInsert;

export const CollectionUserInsertSchema = createInsertSchema(CollectionUser);
export const CollectionUserSelectSchema = createSelectSchema(CollectionUser);
