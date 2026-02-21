import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database.constants';
import type { Db } from 'src/database/database.schema';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Db,
    private readonly userService: UserService,
  ) {}

  signIn(signInDto: SignInDto) {}

  signUp(signUpDto: SignUpDto) {}
}
