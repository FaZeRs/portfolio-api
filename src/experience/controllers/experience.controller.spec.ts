import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { ExperienceController } from './experience.controller';
import { ExperienceService } from '../services/experience.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  CreateExperienceInput,
  UpdateExperienceInput,
} from '../dto/experience-input.dto';
import { ExperienceOutput } from '../dto/experience-output.dto';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';

describe('ExperienceController', () => {
  let controller: ExperienceController;
  const mockedExperienceService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [
        { provide: ExperienceService, useValue: mockedExperienceService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = moduleRef.get<ExperienceController>(ExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create experience', () => {
    let input: CreateExperienceInput;

    beforeEach(() => {
      const currentDate = new Date();
      input = {
        title: 'Test Position',
        organisation: 'Test Employer',
        description: 'Test Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };
    });

    it('should call experienceService.create with correct input', () => {
      controller.create(ctx, input);
      expect(mockedExperienceService.create).toHaveBeenCalledWith(ctx, input);
    });

    it('should return data which includes info from experienceService.create', async () => {
      const currentDate = new Date();
      const expectedOutput: ExperienceOutput = {
        id: uuidv4(),
        title: 'Test Position',
        organisation: 'Test Employer',
        description: 'Test Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedExperienceService.create.mockResolvedValue(expectedOutput);

      expect(await controller.create(ctx, input)).toEqual({
        data: expectedOutput,
        meta: {},
      });
    });

    it('should throw error when experienceService.create throws an error', async () => {
      mockedExperienceService.create.mockRejectedValue({
        message: 'rejected',
      });

      try {
        await controller.create(ctx, input);
      } catch (error) {
        expect(error.message).toEqual('rejected');
      }
    });
  });

  describe('Get experiences', () => {
    it('should call service method findAll', () => {
      mockedExperienceService.findAll.mockResolvedValue({
        experiences: [],
        meta: null,
      });
      const queryParams: PaginationParamsDto = {
        limit: 100,
        offset: 0,
      };

      controller.findAll(ctx, queryParams);
      expect(mockedExperienceService.findAll).toHaveBeenCalledWith(
        ctx,
        queryParams.limit,
        queryParams.offset,
      );
    });
  });

  describe('Get experience by id', () => {
    it('should call service method findOne with id', () => {
      const id = uuidv4();

      controller.findOne(ctx, id);
      expect(mockedExperienceService.findOne).toHaveBeenCalledWith(ctx, id);
    });
  });

  describe('Update experience', () => {
    it('should call experienceService.updateExperience with correct parameters', () => {
      const experienceId = uuidv4();
      const currentDate = new Date();
      const input: UpdateExperienceInput = {
        title: 'Test Position',
        organisation: 'Test Employer',
        description: 'Test Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };
      controller.update(ctx, experienceId, input);
      expect(mockedExperienceService.update).toHaveBeenCalledWith(
        ctx,
        experienceId,
        input,
      );
    });
  });

  describe('Delete experience', () => {
    it('should call experienceService.remove with correct id', () => {
      const experienceId = uuidv4();
      controller.remove(ctx, experienceId);
      expect(mockedExperienceService.remove).toHaveBeenCalledWith(
        ctx,
        experienceId,
      );
    });
  });
});
