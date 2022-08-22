import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperienceService } from './services/experience.service';
import { ExperienceController } from './controllers/experience.controller';
import { ExperienceAclService } from './services/experience-acl.service';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { Experience } from './entities/experience.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Experience]), UserModule],
  controllers: [ExperienceController],
  providers: [ExperienceService, JwtAuthStrategy, ExperienceAclService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
