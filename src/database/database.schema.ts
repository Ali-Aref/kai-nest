import * as projectSchema from '../project/project.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const dbSchema = {
  ...projectSchema,
};

export type DbSchema = typeof dbSchema;
export type Db = NodePgDatabase<DbSchema>;
