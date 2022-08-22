import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { ContactInput } from '../dto/contact-input.dto';
import { AppLogger } from '../../shared/logger/logger.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectQueue('mail') private readonly mailQueue: Queue,
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MailService.name);
  }

  async sendContactMessage(
    ctx: RequestContext,
    input: ContactInput,
  ): Promise<void> {
    this.logger.log(ctx, `${this.sendContactMessage.name} was called`);
    this.mailQueue.add('contact', input);
  }
}
