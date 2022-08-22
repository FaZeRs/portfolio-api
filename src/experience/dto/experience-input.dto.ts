import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExperienceInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organisation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dateFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  dateTo: Date;

  @ApiProperty()
  @IsBoolean()
  onGoing: boolean;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  logoId?: string;
}

export class UpdateExperienceInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organisation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  onGoing?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  logoId?: string;
}
