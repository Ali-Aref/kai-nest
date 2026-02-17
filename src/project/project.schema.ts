import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { todoSchema } from 'src/todo/todo.schema';

export const projectSchema = pgTable('project', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const projectRelations = relations(projectSchema, ({ many }) => ({
  todos: many(todoSchema),
}));
