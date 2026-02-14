import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [DatabaseModule],
})
export class ProjectModule {}
