import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';
import { ProjectAclService } from './services/project-acl.service';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { Project } from './entities/project.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Project]),
    UserModule,
    TagModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, JwtAuthStrategy, ProjectAclService],
  exports: [ProjectService],
})
export class ProjectModule {}
