import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    enum: ProjectStatus,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateProjectInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
