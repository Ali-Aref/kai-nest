import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const projectSchema = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});
