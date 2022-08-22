import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ContactInput } from '../dto/contact-input.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';

@Processor('mail')
export class MailProcessor {
  private readonly ctx = new RequestContext();

  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MailProcessor.name);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      this.ctx,
      `@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(
      this.ctx,
      `@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    this.logger.log(
      this.ctx,
      `@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('contact')
  async sendContactMessage(job: Job<ContactInput>): Promise<any> {
    this.logger.log(this.ctx, `${this.sendContactMessage.name} was called`);
    await this.mailerService.sendMail({
      to: this.configService.get('mail.from'),
      from: `"${job.data.name}" <${job.data.email}>`,
      subject: 'New contact message',
      template: 'contact',
      context: {
        name: job.data.name,
        email: job.data.email,
        message: job.data.message,
      },
    });
  }
}
