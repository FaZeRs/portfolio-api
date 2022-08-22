import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { ExperienceModule } from './experience/experience.module';
import { ProjectModule } from './project/project.module';
import { TagModule } from './tag/tag.module';
import { LinkModule } from './link/link.module';
import { MailModule } from './mail/mail.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    SharedModule,
    FileModule,
    UserModule,
    AuthModule,
    ExperienceModule,
    ProjectModule,
    TagModule,
    LinkModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
