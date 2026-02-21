import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as projectSchema from '../project/project.schema';
import * as todoSchema from '../todo/todo.schema';
import * as tagSchema from '../tag/tag.schema';
import * as userSchema from 'src/user/user.schema';

export const dbSchema = {
  ...projectSchema,
  ...todoSchema,
  ...tagSchema,
  ...userSchema,
};

export type DbSchema = typeof dbSchema;
export type Db = NodePgDatabase<DbSchema>;
