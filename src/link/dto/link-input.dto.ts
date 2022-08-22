import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLinkInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateLinkInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
