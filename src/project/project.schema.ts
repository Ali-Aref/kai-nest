import { relations } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { todoSchema } from 'src/todo/todo.schema';
import { userSchema } from 'src/user/user.schema';

export const projectSchema = pgTable('project', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => userSchema.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const projectRelations = relations(
  projectSchema,
  ({ many, one }) => ({
    todos: many(todoSchema),
    owner: one(userSchema, {
      fields: [projectSchema.ownerId],
      references: [userSchema.id],
    }),
  }),
);
