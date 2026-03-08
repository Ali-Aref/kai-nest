import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DATABASE_CONNECTION } from 'src/database/database.constants';
import type { Db } from 'src/database/database.schema';
import { eq, ilike } from 'drizzle-orm';
import { projectSchema } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Db,
  ) {}

  getProjectList(search: string) {
    if (search) return this.searchProject(search);
    return this.db.query.projectSchema.findMany();
  }

  searchProject(search: string) {
    if (search) {
      return this.db.query.projectSchema.findMany({
        where: ilike(projectSchema.name, search),
      });
    }
  }

  async getProjectById(id: number) {
    const project = await this.db.query.projectSchema.findFirst({
      where: eq(projectSchema.id, id),
    });
    if (!project) {
      throw new NotFoundException(`Project with id of ${id} not found`);
    }
    return project;
  }

  async createProject(payload: CreateProjectDto, ownerId: number) {
    const [newProject] = await this.db
      .insert(projectSchema)
      .values({
        name: payload.name,
        ownerId,
      })
      .returning();
    return newProject;
  }

  async updateProject(id: number, payload: UpdateProjectDto) {
    const [project] = await this.db
      .update(projectSchema)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(projectSchema.id, id))
      .returning();

    if (!project) {
      throw new NotFoundException(`Project with id of ${id} not found`);
    }

    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await this.db.delete(projectSchema).where(eq(projectSchema.id, id));
  }
}
