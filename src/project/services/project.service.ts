import { plainToInstance } from 'class-transformer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateProjectInput,
  UpdateProjectInput,
} from '../dto/project-input.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ProjectAclService } from './project-acl.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { ProjectOutput } from '../dto/project-output.dto';
import { Project } from '../entities/project.entity';
import { Actor } from '../../shared/acl/actor.constant';
import { Action } from '../../shared/acl/action.constant';
import { Link } from '../../link/entities/link.entity';
import { File } from '../../file/entities/file.entity';
import { TagService } from '../../tag/services/tag.service';
import { Tag } from '../../tag/entities/tag.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private repository: Repository<Project>,
    private aclService: ProjectAclService,
    private readonly tagService: TagService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ProjectService.name);
  }

  async create(
    ctx: RequestContext,
    input: CreateProjectInput,
  ): Promise<ProjectOutput> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const project = plainToInstance(Project, input);

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, project);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedProject = await this.repository.save(project);

    return plainToInstance(ProjectOutput, savedProject, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<{ projects: ProjectOutput[]; count: number }> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findAndCount`);
    const [projects, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    const projectsOutput = plainToInstance(ProjectOutput, projects);

    return { projects: projectsOutput, count };
  }

  async findOne(ctx: RequestContext, id: string): Promise<ProjectOutput> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const project = await this.repository.findOne({
      where: {
        id,
      },
    });

    return plainToInstance(ProjectOutput, project);
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateProjectInput,
  ): Promise<ProjectOutput> {
    this.logger.log(ctx, `${this.update.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const project = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, project);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const updatedProject: Project = {
      ...project,
      ...plainToInstance(Project, input),
    };

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedProject = await this.repository.save(updatedProject);

    return plainToInstance(ProjectOutput, savedProject, {
      excludeExtraneousValues: true,
    });
  }

  async remove(ctx: RequestContext, id: string): Promise<void> {
    this.logger.log(ctx, `${this.remove.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const project = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Delete, project);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.remove`);
    await this.repository.remove(project);
  }

  async addImage(
    ctx: RequestContext,
    id: string,
    file: File,
  ): Promise<ProjectOutput> {
    this.logger.log(ctx, `${this.addImage.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const project = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, project);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    project.images.push(file);
    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedProject = await this.repository.save(project);

    return plainToInstance(ProjectOutput, savedProject);
  }

  async addLink(
    ctx: RequestContext,
    id: string,
    link: Link,
  ): Promise<ProjectOutput> {
    this.logger.log(ctx, `${this.addLink.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const project = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, project);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    project.links.push(link);
    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedProject = await this.repository.save(project);

    return plainToInstance(ProjectOutput, savedProject);
  }

  async addTag(
    ctx: RequestContext,
    id: string,
    tagId: string,
  ): Promise<ProjectOutput> {
    this.logger.log(ctx, `${this.addTag.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const project = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, project);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const tag = await this.tagService.findOne(ctx, tagId);
    project.tags.push(plainToInstance(Tag, tag));
    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedProject = await this.repository.save(project);

    return plainToInstance(ProjectOutput, savedProject);
  }
}
