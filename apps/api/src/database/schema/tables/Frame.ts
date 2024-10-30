import { relations } from 'drizzle-orm';
import { integer, pgTable, real, serial, text } from 'drizzle-orm/pg-core';
import { Video } from './Video.js';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { realArray } from '../custom-types.js';

export const Frame = pgTable('frame', {
  id: serial('id').primaryKey(),
  videoId: integer('video_id').notNull(),
  secondsFromStart: real('seconds_from_start').notNull(),
  description: text('description').notNull(), // Temporary as long as I use text instead of images
  embedding: realArray('embedding').notNull(),
});

export const frameRelations = relations(Frame, ({ one }) => ({
  video: one(Video, { fields: [Frame.videoId], references: [Video.id] }),
}));

export type FrameInsert = typeof Frame.$inferInsert;
export type FrameSelect = typeof Frame.$inferSelect;

export const FrameInsertSchema = createInsertSchema(Frame);
export const FrameSelectSchema = createSelectSchema(Frame);
