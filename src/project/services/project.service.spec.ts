import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ROLE } from '../../auth/constants/role.constant';
import {
  CreateProjectInput,
  UpdateProjectInput,
} from '../dto/project-input.dto';
import { ProjectAclService } from './project-acl.service';
import { ProjectService } from './project.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ProjectOutput } from '../dto/project-output.dto';
import { Project, ProjectStatus } from '../entities/project.entity';
import { TagService } from '../../tag/services/tag.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let mockedRepository: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
  const mockedTagService = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: ProjectAclService, useValue: new ProjectAclService() },
        { provide: TagService, useValue: mockedTagService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<ProjectService>(ProjectService);
    mockedRepository = moduleRef.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create Project', () => {
    it('should call repository save with proper project input and return proper output', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const projectInput: CreateProjectInput = {
        title: 'Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };

      const expected = {
        title: 'Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };

      const expectedOutput = {
        id: uuidv4(),
        title: 'Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };
      mockedRepository.save.mockResolvedValue(expectedOutput);

      const output = await service.create(ctx, projectInput);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe('Find All Projects', () => {
    const limit = 10;
    const offset = 0;
    const currentDate = new Date();

    it('should return projects when found', async () => {
      const expectedOutput: ProjectOutput[] = [
        {
          id: uuidv4(),
          title: 'Test',
          shortDescription: 'Test short description',
          description: 'Test description',
          status: ProjectStatus.OPEN,
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
        projects: expectedOutput,
        count: expectedOutput.length,
      });
    });

    it('should return empty array when projects are not found', async () => {
      const expectedOutput: ProjectOutput[] = [];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.findAll(ctx, limit, offset)).toEqual({
        projects: expectedOutput,
        count: expectedOutput.length,
      });
    });
  });

  describe('Find Project', () => {
    it('should return project by id when project is found', async () => {
      const id = uuidv4();
      const currentDate = new Date();

      const expectedOutput: ProjectOutput = {
        id: uuidv4(),
        title: 'Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedRepository.findOne.mockResolvedValue(expectedOutput);

      expect(await service.findOne(ctx, id)).toEqual(expectedOutput);
    });

    it('should fail when project is not found and return the repository error', async () => {
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

  describe('Update Project', () => {
    it('should get project by id', () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const projectId = uuidv4();
      const input: UpdateProjectInput = {
        title: 'New Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: projectId,
        title: 'Old Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      });

      service.update(ctx, projectId, input);
      expect(mockedRepository.findOne).toHaveBeenCalledWith({
        where: { id: projectId },
      });
    });

    it('should save project with updated title and post', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const projectId = uuidv4();
      const input: UpdateProjectInput = {
        title: 'New Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: projectId,
        title: 'Old Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      });

      const expected = {
        id: projectId,
        title: 'New Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };
      await service.update(ctx, projectId, input);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
    });
  });

  describe('Delete Project', () => {
    const projectId = uuidv4();

    it('should call repository.remove with correct parameter', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const foundProject = new Project();
      foundProject.id = projectId;

      mockedRepository.findOne.mockResolvedValue(foundProject);

      await service.remove(ctx, projectId);
      expect(mockedRepository.remove).toHaveBeenCalledWith(foundProject);
    });

    it('should throw not found exception if project not found', async () => {
      mockedRepository.findOne.mockRejectedValue(new NotFoundException());
      try {
        await service.remove(ctx, projectId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
