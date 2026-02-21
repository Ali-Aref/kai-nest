import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [DatabaseModule, UserModule],
})
export class AuthModule {}
