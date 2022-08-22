import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinkService } from './services/link.service';
import { LinkController } from './controllers/link.controller';
import { LinkAclService } from './services/link-acl.service';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { Link } from './entities/link.entity';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Link]),
    UserModule,
    ProjectModule,
  ],
  controllers: [LinkController],
  providers: [LinkService, JwtAuthStrategy, LinkAclService],
  exports: [LinkService],
})
export class LinkModule {}
