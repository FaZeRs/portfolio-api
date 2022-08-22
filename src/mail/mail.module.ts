import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { MailService } from './services/mail.service';
import { MailController } from './controllers/mail.controller';
import { MailProcessor } from './processors/mail.processor';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
    MailerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.host'),
          ignoreTLS: true,
          secure: false,
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.password'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('mail.from')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          // dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'mail',
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
