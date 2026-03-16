import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database.constants';
import type { Db } from 'src/database/database.schema';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { userSchema } from 'src/user/user.schema';
import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Db,
    private readonly userService: UserService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const userExists = await this.userService.findUserByEmail(
      signInDto.email,
    )
    if (!userExists){
      throw new NotFoundException('User not found')
    }

    const hasCorrectPassword = await bcrypt.compare(
       signInDto.password,
       userExists.password,
    )
    if (!hasCorrectPassword) {
      throw new BadRequestException("Invalid password")
    }
    return {
      token: "abcdefghijklmnopqrstuvwxyz"
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const userExists = await this.userService.findUserByEmail(
      signUpDto.email,
    );
    if (userExists) {
      throw new ConflictException('User with this email already exists.');
    }
    return await this.addUserToDB(signUpDto);
  }

  async addUserToDB(signUpDto: SignUpDto) {
    const { password, ...payload } = signUpDto;
    const encryptedPassword = await this.hashValue(signUpDto.password);

    const [user] = await this.db
      .insert(userSchema)
      .values({ ...payload, password: encryptedPassword })
      .returning();

    return user;
  }

  async hashValue(value: string, salt: number = 10): Promise<string> {
    const h = await bcrypt.genSalt(salt);
    return await bcrypt.hash(value, h);
  }
}
