import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class LinkOutput {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty()
  icon: string;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
