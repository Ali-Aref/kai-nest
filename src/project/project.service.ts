import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateProjectDto,
  ProjectItemDto,
  UpdateProjectDto,
} from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly configService: ConfigService) {}

  private projects: ProjectItemDto[] = [
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

  getProjectById(id: number): ProjectItemDto {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project with id of ${id} not found`);
    }
    return project;
  }

  createProject(payload: CreateProjectDto): ProjectItemDto {
    const newId = this.projects[this.projects.length - 1].id + 1;
    const newProject = { id: newId, createdAt: new Date(), ...payload };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: number, payload: UpdateProjectDto): ProjectItemDto {
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
