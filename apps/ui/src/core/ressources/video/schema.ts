import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { Collection } from '../collection/schema';
import { Frame } from '../frame/schema';
import { createdAt } from '@/core/db-utils';
import { zodKeys } from '@/utils/zod-keys';
import { z } from 'zod';

export const VideoStatusEnum = pgEnum('video_status', ['awaiting-upload', 'analyzing', 'ready']);

export const Video = pgTable('video', {
  createdAt,
  id: text('id').primaryKey(),
  collectionId: text('collection_id')
    .notNull()
    .references(() => Collection.id),
  title: text('title').notNull(),
  status: VideoStatusEnum('status').notNull(),
});

export const videoRelations = relations(Video, ({ one, many }) => ({
  collection: one(Collection, { fields: [Video.collectionId], references: [Collection.id] }),
  frames: many(Frame),
}));

const InsertSchema = createInsertSchema(Video);
const VideoInsertSchema = InsertSchema.omit({ createdAt: true }).extend({ [zodKeys(InsertSchema).collectionId]: InsertSchema.shape.collectionId.min(1) });
const VideoUpdateSchema = VideoInsertSchema.omit({ id: true }).partial();
const VideoSelectSchema = createSelectSchema(Video);

export type VideoInsert = z.infer<typeof VideoInsertSchema>;
export type VideoUpdate = z.infer<typeof VideoUpdateSchema>;
export type VideoSelect = z.infer<typeof VideoSelectSchema>;
