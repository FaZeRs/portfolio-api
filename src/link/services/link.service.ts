import { plainToClass } from 'class-transformer';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateLinkInput, UpdateLinkInput } from '../dto/link-input.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { LinkAclService } from './link-acl.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { LinkOutput } from '../dto/link-output.dto';
import { Link } from '../entities/link.entity';
import { Actor } from '../../shared/acl/actor.constant';
import { Action } from '../../shared/acl/action.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from '../../project/services/project.service';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private repository: Repository<Link>,
    private projectService: ProjectService,
    private aclService: LinkAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(LinkService.name);
  }

  async create(
    ctx: RequestContext,
    project: string,
    input: CreateLinkInput,
  ): Promise<LinkOutput> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const link = plainToClass(Link, input);

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, link);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedLink = await this.repository.save(link);

    this.projectService.addLink(ctx, project, savedLink);

    return plainToClass(LinkOutput, savedLink, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    ctx: RequestContext,
    project: string,
    limit: number,
    offset: number,
  ): Promise<{ links: LinkOutput[]; count: number }> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findAndCount`);
    const [links, count] = await this.repository.findAndCount({
      where: {
        project: {
          id: project,
        }
      },
      take: limit,
      skip: offset,
    });

    const linksOutput = plainToClass(LinkOutput, links, {
      excludeExtraneousValues: true,
    });

    return { links: linksOutput, count };
  }

  async findOne(ctx: RequestContext, id: string): Promise<LinkOutput> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const link = await this.repository.findOne({
      where: {
        id,
      },
    });

    return plainToClass(LinkOutput, link, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateLinkInput,
  ): Promise<LinkOutput> {
    this.logger.log(ctx, `${this.update.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const link = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, link);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const updatedLink: Link = {
      ...link,
      ...plainToClass(Link, input),
    };

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedLink = await this.repository.save(updatedLink);

    return plainToClass(LinkOutput, savedLink, {
      excludeExtraneousValues: true,
    });
  }

  async remove(ctx: RequestContext, id: string): Promise<void> {
    this.logger.log(ctx, `${this.remove.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const link = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Delete, link);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.remove`);
    await this.repository.remove(link);
  }
}
