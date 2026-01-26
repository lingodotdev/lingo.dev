import { pgTable, serial, integer, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
});

export const cachedContent = pgTable('cached_content', {
  id: serial('id').primaryKey(),
  contentHash: text('content_hash').notNull().unique(),
  contentType: text('content_type').notNull(), // 'joke' or 'quote'
  translations: jsonb('translations').notNull(), // {"en": {"text": "...", "author": "..."}, ...}
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const githubStats = pgTable('github_stats', {
  id: serial('id').primaryKey(),
  stargazersCount: integer('stargazers_count').notNull(),
  watchersCount: integer('watchers_count').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
