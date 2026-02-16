import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DATABASE_CONNECTION } from 'src/database/database.constants';
import type { Db } from 'src/database/database.schema';
import { todoSchema } from './todo.schema';
import { eq } from 'drizzle-orm';
import { DrizzleQueryError } from 'drizzle-orm/errors';
import { DatabaseError } from 'pg';

@Injectable()
export class TodoService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Db,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    try {
      const [todo] = await this.db
        .insert(todoSchema)
        .values(createTodoDto)
        .returning();
      return todo;
    } catch (error: unknown) {
      if (
        error instanceof DrizzleQueryError &&
        error.cause instanceof DatabaseError
      ) {
        if (error.cause.code === '23503') {
          throw new BadRequestException(
            `Project with id ${createTodoDto.projectId} does not exist`,
          );
        }
        throw error;
      }
    }
  }

  async findAll() {
    return await this.db.query.todoSchema.findMany();
  }

  async findOne(id: number) {
    const todo = await this.db.query.todoSchema.findFirst({
      where: eq(todoSchema.id, id),
    });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} doesn't exist`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const [todo] = await this.db
      .update(todoSchema)
      .set({
        ...updateTodoDto,
        updatedAt: new Date(),
      })
      .where(eq(todoSchema.id, id))
      .returning();

    if (!todo) {
      throw new NotFoundException("Todo doesn't exist");
    }
    return todo;
  }

  async remove(id: number) {
    await this.db.delete(todoSchema).where(eq(todoSchema.id, id));
  }
}
