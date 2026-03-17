import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database.constants';
import type { Db } from 'src/database/database.schema';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { userSchema } from 'src/user/user.schema';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Db,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const userExists = await this.userService.findUserByEmail(
      signInDto.email,
    );
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const hasCorrectPassword = await bcrypt.compare(
      signInDto.password,
      userExists.password,
    );
    if (!hasCorrectPassword) {
      throw new BadRequestException('Invalid password');
    }

    return {
      user: userExists,
      accessToken: this.generateAccessToken(userExists),
      refreshToken: this.generateRefreshToken(userExists),
    };
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
    const encryptedPassword = await this.hashValue(password);

    const [user] = await this.db
      .insert(userSchema)
      .values({ ...payload, password: encryptedPassword })
      .returning({
        id: userSchema.id,
        firstName: userSchema.firstName,
        lastName: userSchema.lastName,
        email: userSchema.email,
        isEmailVerified: userSchema.isEmailVerified,
        createdAt: userSchema.createdAt,
      });

    return user;
  }

  async hashValue(value: string, salt: number = 10): Promise<string> {
    const h = await bcrypt.genSalt(salt);
    return await bcrypt.hash(value, h);
  }

  generateAccessToken(user: typeof userSchema.$inferSelect): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  generateRefreshToken(user: typeof userSchema.$inferSelect): string {
    const payload = { id: user.id };
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '15m',
    });
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    try {
      const payload: { id: number } = this.jwtService.verify(
        refreshToken,
        { secret: this.config.get('JWT_REFRESH_SECRET') },
      );
      const user = await this.userService.findOne(payload.id);

      return {
        accessToken: this.generateAccessToken(user),
      };
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
