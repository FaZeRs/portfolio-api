import { plainToInstance } from 'class-transformer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateExperienceInput,
  UpdateExperienceInput,
} from '../dto/experience-input.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ExperienceAclService } from './experience-acl.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { ExperienceOutput } from '../dto/experience-output.dto';
import { Experience } from '../entities/experience.entity';
import { Actor } from '../../shared/acl/actor.constant';
import { Action } from '../../shared/acl/action.constant';
import { File } from '../../file/entities/file.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private repository: Repository<Experience>,
    private aclService: ExperienceAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ExperienceService.name);
  }

  async create(
    ctx: RequestContext,
    input: CreateExperienceInput,
  ): Promise<ExperienceOutput> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const experience = plainToInstance(Experience, input);

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, experience);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedExperience = await this.repository.save(experience);

    return plainToInstance(ExperienceOutput, savedExperience);
  }

  async findAll(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<{ experiences: ExperienceOutput[]; count: number }> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findAndCount`);
    const [experiences, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
      relations: ['logo'],
      order: {
        dateFrom: 'DESC',
      },
    });

    const experiencesOutput = plainToInstance(ExperienceOutput, experiences);

    return { experiences: experiencesOutput, count };
  }

  async findOne(ctx: RequestContext, id: string): Promise<ExperienceOutput> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const experience = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['logo'],
    });

    return plainToInstance(ExperienceOutput, experience);
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateExperienceInput,
  ): Promise<ExperienceOutput> {
    this.logger.log(ctx, `${this.update.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const experience = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, experience);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const updatedExperience: Experience = {
      ...experience,
      ...plainToInstance(Experience, input),
    };

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedExperience = await this.repository.save(updatedExperience);

    return plainToInstance(ExperienceOutput, savedExperience);
  }

  async remove(ctx: RequestContext, id: string): Promise<void> {
    this.logger.log(ctx, `${this.remove.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const experience = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Delete, experience);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.remove`);
    await this.repository.remove(experience);
  }

  async addLogo(
    ctx: RequestContext,
    id: string,
    file: File,
  ): Promise<ExperienceOutput> {
    this.logger.log(ctx, `${this.addLogo.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const experience = await this.repository.findOne({
      where: {
        id,
      },
      loadEagerRelations: false,
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, experience);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const input: UpdateExperienceInput = {
      logoId: file.id,
    };
    const updatedExperience: Experience = {
      ...experience,
      ...plainToInstance(Experience, input),
    };
    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedExperience = await this.repository.save(updatedExperience);

    return plainToInstance(ExperienceOutput, savedExperience);
  }
}
