import { relations } from 'drizzle-orm';
import { varchar } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { serial } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { todoSchema } from 'src/todo/todo.schema';

export const roleEnum = pgEnum('role', ['Admin', 'User']);

export const userSchema = pgTable('user', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 128 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 128 }).notNull(),
  lastName: varchar('last_name', { length: 128 }).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false),
  role: roleEnum().default('User'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const userRelations = relations(userSchema, ({ many }) => ({
  projects: many(todoSchema),
}));
