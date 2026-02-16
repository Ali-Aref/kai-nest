import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [DatabaseModule],
})
export class TagModule {}
