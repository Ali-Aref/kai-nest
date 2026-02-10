import { IsEnum, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  APP_NAME: string;

  @IsEnum([8000])
  PORT: number;

  @IsString()
  HOST: string;
}
