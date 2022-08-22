import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileOutput {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty()
  mimeType: string;

  @Expose()
  @ApiProperty()
  encoding: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
