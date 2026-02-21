import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/database/database.constants';
import type { Db } from 'src/database/database.schema';
import { userSchema } from './user.schema';

@Injectable()
export class UserService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Db) {}

  async findAll() {
    return await this.db.query.userSchema.findMany();
  }

  async findOne(id: number) {
    const user = await this.db.query.userSchema.findFirst({
      where: eq(userSchema.id, id),
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
