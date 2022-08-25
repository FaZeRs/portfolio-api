import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

import { CreateUserInput } from '../dto/user-create-input.dto';
import { UserOutput } from '../dto/user-output.dto';
import { UpdateUserInput } from '../dto/user-update-input.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserService.name);
  }
  async createUser(
    ctx: RequestContext,
    input: CreateUserInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.createUser.name} was called`);

    const user = plainToClass(User, input);

    user.password = await hash(input.password);

    this.logger.log(ctx, `calling ${Repository.name}.saveUser`);
    await this.repository.save(user);

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async validateUsernamePassword(
    ctx: RequestContext,
    username: string,
    pass: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.validateUsernamePassword.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const user = await this.repository.findOne({
      where: {
        username,
      },
    });
    if (!user) throw new UnauthorizedException();

    const match = await verify(user.password, pass);
    if (!match) throw new UnauthorizedException();

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUsers(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<{ users: UserOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getUsers.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findAndCount`);
    const [users, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    const usersOutput = plainToClass(UserOutput, users, {
      excludeExtraneousValues: true,
    });

    return { users: usersOutput, count };
  }

  async findById(ctx: RequestContext, id: string): Promise<UserOutput> {
    this.logger.log(ctx, `${this.findById.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne ${id}`);
    const user = await this.repository.findOne({
      where: {
        id,
      },
    });

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUserById(ctx: RequestContext, id: string): Promise<UserOutput> {
    this.logger.log(ctx, `${this.getUserById.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const user = await this.repository.findOne({
      where: {
        id,
      },
    });

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByUsername(
    ctx: RequestContext,
    username: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.findByUsername.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOneBy`);
    const user = await this.repository.findOne({
      where: {
        username,
      },
    });

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(
    ctx: RequestContext,
    userId: string,
    input: UpdateUserInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateUser.name} was called`);

    this.logger.log(ctx, `calling ${Repository.name}.findOne`);
    const user = await this.repository.findOne({
      where: {
        id: userId,
      },
    });

    // Hash the password if it exists in the input payload.
    if (input.password) {
      input.password = await hash(input.password);
    }

    // merges the input (2nd line) to the found user (1st line)
    const updatedUser: User = {
      ...user,
      ...plainToClass(User, input),
    };

    this.logger.log(ctx, `calling ${Repository.name}.save`);
    await this.repository.save(updatedUser);

    return plainToClass(UserOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
