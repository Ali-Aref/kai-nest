import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getProjectListService, ProjectItem } from './project.interface';

@Injectable()
export class ProjectService {
  constructor(private readonly configService: ConfigService) {}

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
    if (search) return this.searchProject(search)
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
      throw new NotFoundException(`Project with id of ${id} not found`)
    }
    return project;
  }
}
