import { Expose, Exclude } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileOutput } from '../../file/dto/file-output.dto';

export class ExperienceOutput {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  organisation: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  website: string;

  @Expose()
  @ApiProperty()
  dateFrom: Date;

  @Expose()
  @ApiProperty()
  dateTo: Date;

  @Expose()
  @ApiProperty()
  onGoing: boolean;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Exclude()
  @ApiPropertyOptional()
  logoId?: string;

  @Expose()
  @ApiPropertyOptional()
  logo?: FileOutput;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
