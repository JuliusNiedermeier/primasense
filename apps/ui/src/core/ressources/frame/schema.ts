import { relations } from 'drizzle-orm';
import { customType, integer, pgTable, real, serial, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { Video } from '../video/schema';

export const realArray = customType<{ data: number[] }>({ dataType: () => 'real[]' });

export const Frame = pgTable('frame', {
  id: serial('id').primaryKey(),
  videoId: text('video_id').notNull(),
  secondsFromStart: real('seconds_from_start').notNull(),
  embedding: realArray('embedding').notNull(),
});

export const frameRelations = relations(Frame, ({ one }) => ({
  video: one(Video, { fields: [Frame.videoId], references: [Video.id] }),
}));

export type FrameInsert = typeof Frame.$inferInsert;
export type FrameSelect = typeof Frame.$inferSelect;

export const FrameInsertSchema = createInsertSchema(Frame);
export const FrameSelectSchema = createSelectSchema(Frame);
