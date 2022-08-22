import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagService } from './services/tag.service';
import { TagController } from './controllers/tag.controller';
import { TagAclService } from './services/tag-acl.service';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Tag]),
    UserModule,
  ],
  controllers: [TagController],
  providers: [TagService, JwtAuthStrategy, TagAclService],
  exports: [TagService],
})
export class TagModule {}
