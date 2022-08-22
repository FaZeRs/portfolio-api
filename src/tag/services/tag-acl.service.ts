import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';

@Injectable()
export class TagAclService extends BaseAclService<Tag> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.Read]);
  }
}
