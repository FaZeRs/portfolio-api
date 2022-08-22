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
import { ExperienceService } from '../services/experience.service';
import {
  CreateExperienceInput,
  UpdateExperienceInput,
} from '../dto/experience-input.dto';
import { ExperienceOutput } from '../dto/experience-output.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';

@ApiTags('experiences')
@Controller('experiences')
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ExperienceController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create experience API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(ExperienceOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateExperienceInput,
  ): Promise<BaseApiResponse<ExperienceOutput>> {
    const article = await this.experienceService.create(ctx, input);
    return { data: article, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get experiences as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([ExperienceOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<ExperienceOutput[]>> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const { experiences, count } = await this.experienceService.findAll(
      ctx,
      query.limit,
      query.offset,
    );

    return { data: experiences, meta: { count } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get experience by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ExperienceOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<BaseApiResponse<ExperienceOutput>> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    const experience = await this.experienceService.findOne(ctx, id);
    return { data: experience, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update experience API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ExperienceOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() input: UpdateExperienceInput,
  ): Promise<BaseApiResponse<ExperienceOutput>> {
    const experience = await this.experienceService.update(ctx, id, input);
    return { data: experience, meta: {} };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete experience by id API',
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
    return this.experienceService.remove(ctx, id);
  }
}
