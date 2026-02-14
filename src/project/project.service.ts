import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectItem } from './interfaces/project.interface';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from './project.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  private projects: ProjectItem[] = [
    {
      id: 1,
      name: 'Personal',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Work',
      createdAt: new Date(),
    },
  ];

  getProjectList(search: string) {
    if (search) return this.searchProject(search);
    return this.projects;
  }

  searchProject(search: string) {
    if (search) {
      return this.projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
  }

  getProjectById(id: number): ProjectItem {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project with id of ${id} not found`);
    }
    return project;
  }

  createProject(payload: CreateProjectDto): ProjectItem {
    const newId = this.projects[this.projects.length - 1].id + 1;
    const newProject = { id: newId, createdAt: new Date(), ...payload };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: number, payload: UpdateProjectDto): ProjectItem {
    const idx = this.projects.indexOf(this.getProjectById(id));
    this.projects[idx] = {
      ...this.projects[idx],
      ...payload,
      updatedAt: new Date(),
    };
    return this.projects[idx];
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter((p) => p.id !== id);
  }
}
