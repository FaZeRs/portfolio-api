import { Injectable } from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';

@Injectable()
export class ProjectAclService extends BaseAclService<Project> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.Read]);
  }
}
