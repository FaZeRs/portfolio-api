import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dto/base-api-response.dto';
import { TagService } from '../services/tag.service';
import { CreateTagInput, UpdateTagInput } from '../dto/tag-input.dto';
import { TagOutput } from '../dto/tag-output.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(TagController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create tag API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(TagOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateTagInput,
  ): Promise<BaseApiResponse<TagOutput>> {
    const article = await this.tagService.create(ctx, input);
    return { data: article, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get tags as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([TagOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<TagOutput[]>> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const { tags, count } = await this.tagService.findAll(
      ctx,
      query.limit,
      query.offset,
    );

    return { data: tags, meta: { count } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tag by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(TagOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<BaseApiResponse<TagOutput>> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    const tag = await this.tagService.findOne(ctx, id);
    return { data: tag, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update tag API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(TagOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() input: UpdateTagInput,
  ): Promise<BaseApiResponse<TagOutput>> {
    const tag = await this.tagService.update(ctx, id, input);
    return { data: tag, meta: {} };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete tag by id API',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async remove(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    this.logger.log(ctx, `${this.remove.name} was called`);
    return this.tagService.remove(ctx, id);
  }
}
