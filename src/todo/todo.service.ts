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
import { todoSchema, todoTagMapping } from './todo.schema';
import { eq, sql } from 'drizzle-orm';
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
    // return await this.db.query.todoSchema.findMany({
    //   with: {
    //     tags: {
    //       columns: {
    //         tagId: true,
    //       },
    //     },
    //   },
    // });
    const query = sql`
      select
        todo.id,
        todo.title,
        todo.is_complete,
        project.name as project_name,
        tag.name as tag_name,
        tag.color as tag_color,
        tag.icon as tag_icon
      from todo
      left join project on todo.project_id = project.id
      left join todo_tag_mapping on todo_tag_mapping.todo_id = todo.id
      left join tag on tag.id = todo_tag_mapping.tag_id
    `;
    const q = await this.db.execute(query);

    const todosMap = new Map();
    for (const row of q.rows) {
      if (!todosMap.has(row.id)) {
        todosMap.set(row.id, {
          id: row.id,
          title: row.title,
          is_complete: row.is_complete,
          project_name: row.project_name,
          tags: [],
        });
      }

      if (row.tag_name) {
        todosMap.get(row.id).tags.push({
          name: row.tag_name,
          color: row.tag_color,
          icon: row.tag_icon,
        });
      }
    }
    const cleanResults = Array.from(todosMap.values());
    return cleanResults;
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
    const { tags, ...payload } = updateTodoDto;
    const [todo] = await this.db
      .update(todoSchema)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(todoSchema.id, id))
      .returning();

    if (!todo) {
      throw new NotFoundException("Todo doesn't exist");
    }
    if (tags) {
      await this.db
        .delete(todoTagMapping)
        .where(eq(todoTagMapping.todoId, todo.id));
      await this.db.insert(todoTagMapping).values(
        tags.map((tagId) => ({
          todoId: todo.id,
          tagId,
        })),
      );
    }
    return todo;
  }

  async remove(id: number) {
    await this.db.delete(todoSchema).where(eq(todoSchema.id, id));
  }
}
