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
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dto/base-api-response.dto';
import { ProjectService } from '../services/project.service';
import {
  CreateProjectInput,
  UpdateProjectInput,
} from '../dto/project-input.dto';
import { ProjectOutput } from '../dto/project-output.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ProjectController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create project API',
  })
  @ApiCreatedResponse({
    type: SwaggerBaseApiResponse(ProjectOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateProjectInput,
  ): Promise<BaseApiResponse<ProjectOutput>> {
    const article = await this.projectService.create(ctx, input);
    return { data: article, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get projects as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([ProjectOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<ProjectOutput[]>> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const { projects, count } = await this.projectService.findAll(
      ctx,
      query.limit,
      query.offset,
    );

    return { data: projects, meta: { count } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ProjectOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<BaseApiResponse<ProjectOutput>> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    const project = await this.projectService.findOne(ctx, id);
    return { data: project, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ProjectOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() input: UpdateProjectInput,
  ): Promise<BaseApiResponse<ProjectOutput>> {
    const project = await this.projectService.update(ctx, id, input);
    return { data: project, meta: {} };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete project by id API',
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
    return this.projectService.remove(ctx, id);
  }

  @Patch(':id/tag/:tag')
  @ApiOperation({
    summary: 'Attach tag to project API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ProjectOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async attachTag(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Param('tag') tag: string,
  ): Promise<BaseApiResponse<ProjectOutput>> {
    this.logger.log(ctx, `${this.attachTag.name} was called`);
    const project = await this.projectService.addTag(ctx, id, tag);
    return { data: project, meta: {} };
  }
}
