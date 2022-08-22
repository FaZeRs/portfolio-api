import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';
import { FileOutput } from '../../file/dto/file-output.dto';
import { LinkOutput } from '../../link/dto/link-output.dto';
import { TagOutput } from '../../tag/dto/tag-output.dto';

export class ProjectOutput {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  shortDescription: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty({
    enum: ProjectStatus,
  })
  status: ProjectStatus;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty({ type: () => [FileOutput] })
  images?: FileOutput[];

  @Expose()
  @ApiProperty({ type: () => [LinkOutput] })
  links?: LinkOutput[];

  @Expose()
  @ApiProperty({ type: () => [TagOutput] })
  tags?: TagOutput[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
