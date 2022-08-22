import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { plainToInstance } from 'class-transformer';

import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dto/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FileService } from '../services/file.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { ApiFile } from '../decorators/api-file.decorator';
import { FileOutput } from '../dto/file-output.dto';
import { fileMimetypeFilter } from '../../file/filters/file-mimetype.filter';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FileController.name);
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Upload single file API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(FileOutput),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiFile('logo', true)
  async uploadSingle(
    @ReqContext() ctx: RequestContext,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseApiResponse<FileOutput>> {
    const uploadedFile = await this.fileService.create(ctx, file);
    const output = plainToInstance(FileOutput, uploadedFile, {
      excludeExtraneousValues: true,
    });
    return { data: output, meta: {} };
  }

  @Post('uploads')
  @ApiOperation({
    summary: 'Upload multiple files API',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultiple(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove image API',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async remove(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    this.logger.log(ctx, `${this.remove.name} was called`);
    return this.fileService.remove(ctx, id);
  }

  @Post('project/:id')
  @ApiOperation({
    summary: 'Add project image API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(FileOutput),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiFile('image', true, { fileFilter: fileMimetypeFilter('image') })
  async addProjectImage(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseApiResponse<FileOutput>> {
    this.logger.log(ctx, `${this.addProjectImage.name} was called`);
    const image = await this.fileService.addProjectImage(ctx, id, file);
    return { data: image, meta: {} };
  }

  @Post('experience/:id')
  @ApiOperation({
    summary: 'Add experience logo API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(FileOutput),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiFile('logo', true, { fileFilter: fileMimetypeFilter('image') })
  async addExperienceLogo(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseApiResponse<FileOutput>> {
    this.logger.log(ctx, `${this.addExperienceLogo.name} was called`);
    const logo = await this.fileService.addExperienceLogo(ctx, id, file);
    return { data: logo, meta: {} };
  }
}
