import { relations } from 'drizzle-orm';
import { numeric, pgTable, real, serial, text } from 'drizzle-orm/pg-core';
import { Collection } from './Collection.js';
import { Frame } from './Frame.js';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';

export const Video = pgTable('video', {
  id: serial('id').primaryKey(),
  collectionId: text('collection_id').notNull(),
  durationInSeconds: real('duration_in_seconds').notNull(),
});

export const videoRelations = relations(Video, ({ one, many }) => ({
  collection: one(Collection, { fields: [Video.collectionId], references: [Collection.id] }),
  frames: many(Frame),
}));

export type VideoInsert = typeof Video.$inferInsert;
export type VideoSelect = typeof Video.$inferSelect;

export const VideoInsertSchema = createInsertSchema(Video);
export const VideoSelectSchema = createSelectSchema(Video);
