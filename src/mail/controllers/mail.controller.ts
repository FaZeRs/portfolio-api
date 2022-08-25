import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { ContactInput } from '../dto/contact-input.dto';
import { MailService } from '../services/mail.service';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MailController.name);
  }

  @Post('contact')
  @ApiOperation({
    summary: 'Send contact message',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async sendContactMessage(
    @ReqContext() ctx: RequestContext,
    @Body() input: ContactInput,
  ): Promise<void> {
    this.logger.log(ctx, `${this.sendContactMessage.name} was called`);
    return this.mailService.sendContactMessage(ctx, input);
  }
}
