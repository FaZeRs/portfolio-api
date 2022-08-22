import { Injectable } from '@nestjs/common';
import { Experience } from '../entities/experience.entity';
import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';

@Injectable()
export class ExperienceAclService extends BaseAclService<Experience> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.Read]);
  }
}
