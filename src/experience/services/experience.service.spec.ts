import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ROLE } from '../../auth/constants/role.constant';
import {
  CreateExperienceInput,
  UpdateExperienceInput,
} from '../dto/experience-input.dto';
import { ExperienceAclService } from './experience-acl.service';
import { ExperienceService } from './experience.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ExperienceOutput } from '../dto/experience-output.dto';
import { Experience } from '../entities/experience.entity';

describe('ExperienceService', () => {
  let service: ExperienceService;
  let mockedRepository: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        {
          provide: getRepositoryToken(Experience),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: ExperienceAclService, useValue: new ExperienceAclService() },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<ExperienceService>(ExperienceService);
    mockedRepository = moduleRef.get(getRepositoryToken(Experience));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create Experience', () => {
    it('should call repository save with proper experience input and return proper output', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const currentDate = new Date();
      const experienceInput: CreateExperienceInput = {
        title: 'Test Position',
        organisation: 'Test Employer',
        description: 'Test Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };

      const expected = {
        title: 'Test Position',
        organisation: 'Test Employer',
        description: 'Test Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };

      const expectedOutput = {
        id: uuidv4(),
        title: 'Test Position',
        organisation: 'Test Employer',
        description: 'Test Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };
      mockedRepository.save.mockResolvedValue(expectedOutput);

      const output = await service.create(ctx, experienceInput);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe('Find All Experiences', () => {
    const limit = 10;
    const offset = 0;
    const currentDate = new Date();

    it('should return experiences when found', async () => {
      const expectedOutput: ExperienceOutput[] = [
        {
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
        },
      ];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.findAll(ctx, limit, offset)).toEqual({
        experiences: expectedOutput,
        count: expectedOutput.length,
      });
    });

    it('should return empty array when experiences are not found', async () => {
      const expectedOutput: ExperienceOutput[] = [];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.findAll(ctx, limit, offset)).toEqual({
        experiences: expectedOutput,
        count: expectedOutput.length,
      });
    });
  });

  describe('Find Experience', () => {
    it('should return experience by id when experience is found', async () => {
      const id = uuidv4();
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

      mockedRepository.findOne.mockResolvedValue(expectedOutput);

      expect(await service.findOne(ctx, id)).toEqual(expectedOutput);
    });

    it('should fail when experience is not found and return the repository error', async () => {
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

  describe('Update Experience', () => {
    it('should get experience by id', () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const experienceId = uuidv4();
      const currentDate = new Date();
      const input: UpdateExperienceInput = {
        title: 'New Position',
        organisation: 'New Employer',
        description: 'New Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: experienceId,
        title: 'Old Position',
        organisation: 'Old Employer',
        description: 'Old Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        ongoing: false,
        isActive: true,
      });

      service.update(ctx, experienceId, input);
      expect(mockedRepository.findOne).toHaveBeenCalledWith({
        where: { id: experienceId },
      });
    });

    it('should save experience with updated title and post', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const experienceId = uuidv4();
      const currentDate = new Date();
      const input: UpdateExperienceInput = {
        title: 'New Position',
        organisation: 'New Employer',
        description: 'New Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };

      mockedRepository.findOne.mockResolvedValue({
        id: experienceId,
        title: 'Old Position',
        organisation: 'Old Employer',
        description: 'Old Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      });

      const expected = {
        id: experienceId,
        title: 'New Position',
        organisation: 'New Employer',
        description: 'New Description',
        website: 'https://test.com',
        dateFrom: currentDate,
        dateTo: currentDate,
        onGoing: false,
        isActive: true,
      };
      await service.update(ctx, experienceId, input);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
    });
  });

  describe('Delete Experience', () => {
    const experienceId = uuidv4();

    it('should call repository.remove with correct parameter', async () => {
      ctx.user = {
        id: uuidv4(),
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };

      const foundExperience = new Experience();
      foundExperience.id = experienceId;

      mockedRepository.findOne.mockResolvedValue(foundExperience);

      await service.remove(ctx, experienceId);
      expect(mockedRepository.remove).toHaveBeenCalledWith(foundExperience);
    });

    it('should throw not found exception if experience not found', async () => {
      mockedRepository.findOne.mockRejectedValue(new NotFoundException());
      try {
        await service.remove(ctx, experienceId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
