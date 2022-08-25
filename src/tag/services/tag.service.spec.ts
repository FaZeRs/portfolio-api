import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ROLE } from '../../auth/constants/role.constant';
import { CreateTagInput, UpdateTagInput } from '../dto/tag-input.dto';
import { TagAclService } from './tag-acl.service';
import { TagService } from './tag.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { TagOutput } from '../dto/tag-output.dto';
import { Tag } from '../entities/tag.entity';

describe('TagService', () => {
  let service: TagService;
  let mockedRepository: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: TagAclService, useValue: new TagAclService() },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<TagService>(TagService);
    mockedRepository = moduleRef.get(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create Tag', () => {
    it('should call repository save with proper tag input and return proper output', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const tagInput: CreateTagInput = {
        title: 'Test',
        isActive: true,
      };

      const expected = {
        title: 'Test',
        isActive: true,
      };

      const expectedOutput = {
        id: uuidv4(),
        title: 'Test',
        isActive: true,
      };
      mockedRepository.save.mockResolvedValue(expectedOutput);

      const output = await service.create(ctx, tagInput);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe('Find All Tags', () => {
    const limit = 10;
    const offset = 0;
    const currentDate = new Date();

    it('should return tags when found', async () => {
      const expectedOutput: TagOutput[] = [
        {
          id: uuidv4(),
          title: 'Test',
          isActive: true,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.findAll(ctx, limit, offset)).toEqual({
        tags: expectedOutput,
        count: expectedOutput.length,
      });
    });

    it('should return empty array when tags are not found', async () => {
      const expectedOutput: TagOutput[] = [];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.findAll(ctx, limit, offset)).toEqual({
        tags: expectedOutput,
        count: expectedOutput.length,
      });
    });
  });

  describe('Find Tag', () => {
    it('should return tag by id when tag is found', async () => {
      const id = uuidv4();
      const currentDate = new Date();

      const expectedOutput: TagOutput = {
        id: uuidv4(),
        title: 'Test',
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedRepository.findOne.mockResolvedValue(expectedOutput);

      expect(await service.findOne(ctx, id)).toEqual(expectedOutput);
    });

    it('should fail when tag is not found and return the repository error', async () => {
      const id = uuidv4();

      mockedRepository.findOne.mockRejectedValue({
        message: 'error',
      });

      try {
        await service.findOne(ctx, id);
      } catch (error) {
        expect(error.message).toEqual('error');
      }
    });
  });

  describe('Update Tag', () => {
    it('should get tag by id', () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const tagId = uuidv4();
      const input: UpdateTagInput = {
        title: 'New Test',
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: tagId,
        title: 'Old Test',
        isActive: true,
      });

      service.update(ctx, tagId, input);
      expect(mockedRepository.findOne).toHaveBeenCalledWith({
        where: { id: tagId },
      });
    });

    it('should save tag with updated title', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const tagId = uuidv4();
      const input: UpdateTagInput = {
        title: 'New Test',
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: tagId,
        title: 'Old Test',
        isActive: true,
      });

      const expected = {
        id: tagId,
        title: 'New Test',
        isActive: true,
      };
      await service.update(ctx, tagId, input);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
    });
  });

  describe('Delete Tag', () => {
    const tagId = uuidv4();

    it('should call repository.remove with correct parameter', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const foundTag = new Tag();
      foundTag.id = tagId;

      mockedRepository.findOne.mockResolvedValue(foundTag);

      await service.remove(ctx, tagId);
      expect(mockedRepository.remove).toHaveBeenCalledWith(foundTag);
    });

    it('should throw not found exception if tag not found', async () => {
      mockedRepository.findOne.mockRejectedValue(new NotFoundException());
      try {
        await service.remove(ctx, tagId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
