import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { pgTable, serial } from 'drizzle-orm/pg-core';
import { projectSchema } from 'src/project/project.schema';

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  description: text('description'),
  projectId: integer('project_id').references(() => projectSchema.id, {
    onDelete: 'cascade',
  }),
  isComplete: boolean('is_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const todoRelations = relations(todoSchema, ({ one }) => ({
  project: one(projectSchema, {
    fields: [todoSchema.projectId],
    references: [projectSchema.id],
  }),
}));
