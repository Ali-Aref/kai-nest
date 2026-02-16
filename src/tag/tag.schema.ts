import { relations } from 'drizzle-orm';
import { varchar } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { serial } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { todoTagMapping } from 'src/todo/todo.schema';

export const tagSchema = pgTable('tag', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  icon: varchar('icon', { length: 4 }),
  color: varchar('color', { length: 9 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const tagRelations = relations(tagSchema, ({ many }) => ({
  todos: many(todoTagMapping),
}));
