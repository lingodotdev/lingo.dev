import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
});
