import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  encoding?: string;
}

export class UpdateFileInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  encoding?: string;
}
