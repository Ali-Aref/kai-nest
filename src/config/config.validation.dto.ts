import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  APP_NAME: string;

  @IsEnum([8000])
  PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_URL: string;
}
