import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as projectSchema from '../project/project.schema';
import * as todoSchema from '../todo/todo.schema';

export const dbSchema = {
  ...projectSchema,
  ...todoSchema,
};

export type DbSchema = typeof dbSchema;
export type Db = NodePgDatabase<DbSchema>;
