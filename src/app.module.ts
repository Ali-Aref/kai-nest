import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
