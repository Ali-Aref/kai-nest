import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.validation';
import { DatabaseModule } from './database/database.module';
import { TodoModule } from './todo/todo.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ProjectModule,
    DatabaseModule,
    TodoModule,
    TagModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
