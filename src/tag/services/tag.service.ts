import { plainToInstance } from 'class-transformer';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateTagInput, UpdateTagInput } from '../dto/tag-input.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { TagAclService } from './tag-acl.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { TagOutput } from '../dto/tag-output.dto';
import { Tag } from '../entities/tag.entity';
import { Actor } from '../../shared/acl/actor.constant';
import { Action } from '../../shared/acl/action.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private repository: Repository<Tag>,
    private aclService: TagAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(TagService.name);
  }

  async create(ctx: RequestContext, input: CreateTagInput): Promise<TagOutput> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const tag = plainToInstance(Tag, input);

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, tag);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedTag = await this.repository.save(tag);

    return plainToInstance(TagOutput, savedTag, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<{ tags: TagOutput[]; count: number }> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findAndCount`);
    const [tags, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    const tagsOutput = plainToInstance(TagOutput, tags, {
      excludeExtraneousValues: true,
    });

    return { tags: tagsOutput, count };
  }

  async findOne(ctx: RequestContext, id: string): Promise<TagOutput> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    const actor: Actor = ctx.user;

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const tag = await this.repository.findOne({
      where: {
        id,
      },
    });

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Read, tag);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    return plainToInstance(TagOutput, tag, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateTagInput,
  ): Promise<TagOutput> {
    this.logger.log(ctx, `${this.update.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const tag = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, tag);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const updatedTag: Tag = {
      ...tag,
      ...plainToInstance(Tag, input),
    };

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    const savedTag = await this.repository.save(updatedTag);

    return plainToInstance(TagOutput, savedTag, {
      excludeExtraneousValues: true,
    });
  }

  async remove(ctx: RequestContext, id: string): Promise<void> {
    this.logger.log(ctx, `${this.remove.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const tag = await this.repository.findOne({
      where: {
        id,
      },
    });

    const actor: Actor = ctx.user;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Delete, tag);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${Repository.name}.remove`);
    await this.repository.remove(tag);
  }
}
