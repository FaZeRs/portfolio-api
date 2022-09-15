import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { RequestContext } from '../../shared/request-context/request-context.dto';
import { File } from '../entities/file.entity';
import { AppLogger } from '../../shared/logger/logger.service';
import { CreateFileInput } from '../dto/file-input.dto';
import { FileOutput } from '../dto/file-output.dto';
import { ExperienceService } from '../../experience/services/experience.service';
import { ProjectService } from '../../project/services/project.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
    private readonly experienceService: ExperienceService,
    private readonly projectService: ProjectService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FileService.name);
  }

  async create(ctx: RequestContext, file): Promise<FileOutput> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const input: CreateFileInput = {
      name: file.key,
      url: file.location,
      mimeType: file.mimetype,
      encoding: file.encoding,
    };
    const fileObject = plainToInstance(File, input);

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedFile = await this.repository.save(fileObject);

    return plainToInstance(FileOutput, savedFile);
  }

  async remove(ctx: RequestContext, id: string): Promise<void> {
    this.logger.log(ctx, `${this.remove.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const file = await this.repository.findOne({
      where: {
        id,
      },
    });

    // todo: Delete from S3

    this.logger.log(ctx, `calling ${Repository.name}.remove`);
    await this.repository.remove(file);
  }

  async addProjectImage(
    ctx: RequestContext,
    id: string,
    file,
  ): Promise<FileOutput> {
    const savedFile = await this.create(ctx, file);
    await this.projectService.addImage(
      ctx,
      id,
      plainToInstance(File, savedFile),
    );
    return plainToInstance(FileOutput, savedFile);
  }

  async addExperienceLogo(
    ctx: RequestContext,
    id: string,
    file,
  ): Promise<FileOutput> {
    const savedFile = await this.create(ctx, file);
    // todo: delete old logo if it exists
    await this.experienceService.addLogo(
      ctx,
      id,
      plainToInstance(File, savedFile),
    );
    return plainToInstance(FileOutput, savedFile);
  }
}
