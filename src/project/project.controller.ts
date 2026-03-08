import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects(@Query('search') search: string) {
    if (search) return this.projectService.searchProject(search);
    return this.projectService.getProjectList(search);
  }

  @Get(':id')
  getProjectById(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.getProjectById(id);
  }

  @Post()
  createProject(@Body() payload: CreateProjectDto) {
    // API: fix static owner id
    return this.projectService.createProject(payload, 1);
  }

  @Patch(':id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.deleteProject(id);
  }
}
