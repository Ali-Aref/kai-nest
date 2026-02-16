import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { primaryKey } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { pgTable, serial } from 'drizzle-orm/pg-core';
import { projectSchema } from 'src/project/project.schema';
import { tagSchema } from 'src/tag/tag.schema';

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

export const todoTagMapping = pgTable(
  'todo_tag_mapping',
  {
    todoId: integer('todo_id')
      .notNull()
      .references(() => todoSchema.id, {
        onDelete: 'cascade',
      }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tagSchema.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [primaryKey({ columns: [table.todoId, table.tagId] })],
);

export const todoTagMappingRelations = relations(
  todoTagMapping,
  ({ one }) => ({
    todo: one(todoSchema, {
      fields: [todoTagMapping.todoId],
      references: [todoSchema.id],
    }),
    tag: one(tagSchema, {
      fields: [todoTagMapping.tagId],
      references: [tagSchema.id],
    }),
  }),
);

export const todoRelations = relations(todoSchema, ({ one, many }) => ({
  project: one(projectSchema, {
    fields: [todoSchema.projectId],
    references: [projectSchema.id],
  }),
  tags: many(todoTagMapping),
}));
