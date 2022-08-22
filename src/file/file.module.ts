import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { FileService } from './services/file.service';
import { File } from './entities/file.entity';
import { MulterConfigService } from './configs/multer.config';
import { FileController } from './controllers/file.controller';
import { ExperienceModule } from '../experience/experience.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    SharedModule,
    MulterModule.registerAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useClass: MulterConfigService,
    }),
    TypeOrmModule.forFeature([File]),
    ProjectModule,
    ExperienceModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService, MulterModule],
})
export class FileModule {}
