import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import { projectSchema } from '../project/project.schema';

export const DATABASE_TOKEN = 'DATABASE_CONNECTION';

@Module({
  providers: [
    {
      provide: DATABASE_TOKEN,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.get<string>('DB_URL'),
        });
        return drizzle(pool, {
          schema: {
            // provider your schema here
            ...projectSchema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
