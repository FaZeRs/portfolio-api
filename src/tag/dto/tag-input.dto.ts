import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsHexColor,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateTagInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
