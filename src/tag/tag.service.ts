import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DATABASE_CONNECTION } from 'src/database/database.constants';
import type { Db } from 'src/database/database.schema';
import { tagSchema } from './tag.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TagService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Db,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const [tag] = await this.db
      .insert(tagSchema)
      .values(createTagDto)
      .returning();
    return tag;
  }

  async findAll() {
    return await this.db.query.tagSchema.findMany();
  }

  async findOne(id: number) {
    return await this.db.query.tagSchema.findFirst({
      where: eq(tagSchema.id, id),
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const [tag] = await this.db
      .update(tagSchema)
      .set({
        ...updateTagDto,
        updatedAt: new Date(),
      })
      .where(eq(tagSchema.id, id))
      .returning();

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} doesn't exist.'`);
    }
    return tag;
  }

  async remove(id: number) {
    return this.db.delete(tagSchema).where(eq(tagSchema.id, id));
  }
}
