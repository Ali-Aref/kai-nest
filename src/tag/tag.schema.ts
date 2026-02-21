import { relations } from 'drizzle-orm';
import { varchar } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { serial } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { todoTagMapping } from 'src/todo/todo.schema';
import { userSchema } from 'src/user/user.schema';

export const tagSchema = pgTable('tag', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  icon: varchar('icon', { length: 4 }),
  color: varchar('color', { length: 9 }),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => userSchema.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const tagRelations = relations(tagSchema, ({ many, one }) => ({
  todos: many(todoTagMapping),
  owner: one(userSchema, {
    fields: [tagSchema.ownerId],
    references: [userSchema.id],
  }),
}));
