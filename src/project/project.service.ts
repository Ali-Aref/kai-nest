import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
  getProjectList() {
    return 'project list form the project services 123';
  }
}
