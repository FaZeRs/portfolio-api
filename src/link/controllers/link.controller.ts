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
import { LinkService } from '../services/link.service';
import { CreateLinkInput, UpdateLinkInput } from '../dto/link-input.dto';
import { LinkOutput } from '../dto/link-output.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';

@ApiTags('links')
@Controller('links')
export class LinkController {
  constructor(
    private readonly linkService: LinkService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(LinkController.name);
  }

  @Post(':project')
  @ApiOperation({
    summary: 'Create project link API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(LinkOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @ReqContext() ctx: RequestContext,
    @Param('project') project: string,
    @Body() input: CreateLinkInput,
  ): Promise<BaseApiResponse<LinkOutput>> {
    const link = await this.linkService.create(ctx, project, input);
    return { data: link, meta: {} };
  }

  @Get('project/:project')
  @ApiOperation({
    summary: 'Get project links as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([LinkOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @ReqContext() ctx: RequestContext,
    @Param('project') project: string,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<LinkOutput[]>> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const { links, count } = await this.linkService.findAll(
      ctx,
      project,
      query.limit,
      query.offset,
    );

    return { data: links, meta: { count } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get link by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LinkOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<BaseApiResponse<LinkOutput>> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    const link = await this.linkService.findOne(ctx, id);
    return { data: link, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update link API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LinkOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() input: UpdateLinkInput,
  ): Promise<BaseApiResponse<LinkOutput>> {
    const link = await this.linkService.update(ctx, id, input);
    return { data: link, meta: {} };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete link by id API',
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
    return this.linkService.remove(ctx, id);
  }
}
