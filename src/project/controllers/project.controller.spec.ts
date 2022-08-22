import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { ProjectController } from './project.controller';
import { ProjectService } from '../services/project.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  CreateProjectInput,
  UpdateProjectInput,
} from '../dto/project-input.dto';
import { ProjectOutput } from '../dto/project-output.dto';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';
import { ProjectStatus } from '../entities/project.entity';

describe('ProjectController', () => {
  let controller: ProjectController;
  const mockedProjectService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        { provide: ProjectService, useValue: mockedProjectService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = moduleRef.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create project', () => {
    let input: CreateProjectInput;

    beforeEach(() => {
      input = {
        title: 'Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };
    });

    it('should call projectService.create with correct input', () => {
      controller.create(ctx, input);
      expect(mockedProjectService.create).toHaveBeenCalledWith(ctx, input);
    });

    it('should return data which includes info from projectService.create', async () => {
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

      mockedProjectService.create.mockResolvedValue(expectedOutput);

      expect(await controller.create(ctx, input)).toEqual({
        data: expectedOutput,
        meta: {},
      });
    });

    it('should throw error when projectService.create throws an error', async () => {
      mockedProjectService.create.mockRejectedValue({
        message: 'rejected',
      });

      try {
        await controller.create(ctx, input);
      } catch (error) {
        expect(error.message).toEqual('rejected');
      }
    });
  });

  describe('Get projects', () => {
    it('should call service method findAll', () => {
      mockedProjectService.findAll.mockResolvedValue({
        projects: [],
        meta: null,
      });
      const queryParams: PaginationParamsDto = {
        limit: 100,
        offset: 0,
      };

      controller.findAll(ctx, queryParams);
      expect(mockedProjectService.findAll).toHaveBeenCalledWith(
        ctx,
        queryParams.limit,
        queryParams.offset,
      );
    });
  });

  describe('Get project by id', () => {
    it('should call service method findOne with id', () => {
      const id = uuidv4();

      controller.findOne(ctx, id);
      expect(mockedProjectService.findOne).toHaveBeenCalledWith(ctx, id);
    });
  });

  describe('Update project', () => {
    it('should call projectService.update with correct parameters', () => {
      const projectId = uuidv4();
      const input: UpdateProjectInput = {
        title: 'Test',
        shortDescription: 'Test short description',
        description: 'Test description',
        status: ProjectStatus.OPEN,
        isActive: true,
      };
      controller.update(ctx, projectId, input);
      expect(mockedProjectService.update).toHaveBeenCalledWith(
        ctx,
        projectId,
        input,
      );
    });
  });

  describe('Delete project', () => {
    it('should call projectService.remove with correct id', () => {
      const projectId = uuidv4();
      controller.remove(ctx, projectId);
      expect(mockedProjectService.remove).toHaveBeenCalledWith(ctx, projectId);
    });
  });
});
