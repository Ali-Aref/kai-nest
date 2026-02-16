import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as projectSchema from '../project/project.schema';
import * as todoSchema from '../todo/todo.schema';
import * as tagSchema from '../tag/tag.schema';

export const dbSchema = {
  ...projectSchema,
  ...todoSchema,
  ...tagSchema,
};

export type DbSchema = typeof dbSchema;
export type Db = NodePgDatabase<DbSchema>;
