import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProjectItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  updatedAt?: Date;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateProjectDto {
  @IsString()
  name?: string;
}
