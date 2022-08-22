import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ROLE } from '../../auth/constants/role.constant';
import { CreateLinkInput, UpdateLinkInput } from '../dto/link-input.dto';
import { LinkAclService } from './link-acl.service';
import { LinkService } from './link.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { LinkOutput } from '../dto/link-output.dto';
import { Link } from '../entities/link.entity';
import { ProjectService } from '../../project/services/project.service';

describe('LinkService', () => {
  let service: LinkService;
  let mockedRepository: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
  const mockedProjectService = { addLink: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        {
          provide: getRepositoryToken(Link),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),

            remove: jest.fn(),
          },
        },
        { provide: ProjectService, useValue: mockedProjectService },
        { provide: LinkAclService, useValue: new LinkAclService() },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<LinkService>(LinkService);
    mockedRepository = moduleRef.get(getRepositoryToken(Link));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create Link', () => {
    const projectId = uuidv4();
    it('should call repository save with proper link input and return proper output', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const linkInput: CreateLinkInput = {
        title: 'Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };

      const expected = {
        title: 'Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };

      const expectedOutput = {
        id: uuidv4(),
        title: 'Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };
      mockedRepository.save.mockResolvedValue(expectedOutput);

      const output = await service.create(ctx, projectId, linkInput);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe('Find All Links', () => {
    const limit = 10;
    const offset = 0;
    const currentDate = new Date();
    const projectId = uuidv4();

    it('should return links when found', async () => {
      const expectedOutput: LinkOutput[] = [
        {
          id: uuidv4(),
          title: 'Test',
          url: 'https://test.com',
          icon: 'mdi-github',
          isActive: true,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.findAll(ctx, projectId, limit, offset)).toEqual({
        links: expectedOutput,
        count: expectedOutput.length,
      });
    });

    it('should return empty array when links are not found', async () => {
      const expectedOutput: LinkOutput[] = [];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.findAll(ctx, projectId, limit, offset)).toEqual({
        links: expectedOutput,
        count: expectedOutput.length,
      });
    });
  });

  describe('Find Link', () => {
    it('should return link by id when link is found', async () => {
      const id = uuidv4();
      const currentDate = new Date();

      const expectedOutput: LinkOutput = {
        id: uuidv4(),
        title: 'Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedRepository.findOne.mockResolvedValue(expectedOutput);

      expect(await service.findOne(ctx, id)).toEqual(expectedOutput);
    });

    it('should fail when link is not found and return the repository error', async () => {
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

  describe('Update Link', () => {
    it('should get link by id', () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const linkId = uuidv4();
      const input: UpdateLinkInput = {
        title: 'New Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: linkId,
        title: 'Old Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      });

      service.update(ctx, linkId, input);
      expect(mockedRepository.findOne).toHaveBeenCalledWith({
        where: { id: linkId },
      });
    });

    it('should save link with updated title and post', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const linkId = uuidv4();
      const input: UpdateLinkInput = {
        title: 'New Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: linkId,
        title: 'Old Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      });

      const expected = {
        id: linkId,
        title: 'New Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };
      await service.update(ctx, linkId, input);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
    });
  });

  describe('Delete Link', () => {
    const linkId = uuidv4();

    it('should call repository.remove with correct parameter', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const foundLink = new Link();
      foundLink.id = linkId;

      mockedRepository.findOne.mockResolvedValue(foundLink);

      await service.remove(ctx, linkId);
      expect(mockedRepository.remove).toHaveBeenCalledWith(foundLink);
    });

    it('should throw not found exception if link not found', async () => {
      mockedRepository.findOne.mockRejectedValue(new NotFoundException());
      try {
        await service.remove(ctx, linkId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
