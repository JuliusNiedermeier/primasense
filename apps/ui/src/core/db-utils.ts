import { timestamp, customType } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

// Default createdAt column used in most tables
export const createdAt = timestamp('created_at').notNull().defaultNow();

// Turns the input into a human-readable, yet unique and URL safe slug
export const createSlug = (input: string) => slugify(`${input}-${nanoid(4)}`);