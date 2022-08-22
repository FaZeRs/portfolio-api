import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { TagController } from './tag.controller';
import { TagService } from '../services/tag.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateTagInput, UpdateTagInput } from '../dto/tag-input.dto';
import { TagOutput } from '../dto/tag-output.dto';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';

describe('TagController', () => {
  let controller: TagController;
  const mockedTagService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        { provide: TagService, useValue: mockedTagService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = moduleRef.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create tag', () => {
    let input: CreateTagInput;

    beforeEach(() => {
      input = {
        title: 'Test',
        color: '#FF0000',
        isActive: true,
      };
    });

    it('should call tagService.create with correct input', () => {
      controller.create(ctx, input);
      expect(mockedTagService.create).toHaveBeenCalledWith(ctx, input);
    });

    it('should return data which includes info from tagService.create', async () => {
      const currentDate = new Date();
      const expectedOutput: TagOutput = {
        id: uuidv4(),
        title: 'Test',
        color: '#FF0000',
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedTagService.create.mockResolvedValue(expectedOutput);

      expect(await controller.create(ctx, input)).toEqual({
        data: expectedOutput,
        meta: {},
      });
    });

    it('should throw error when tagService.create throws an error', async () => {
      mockedTagService.create.mockRejectedValue({
        message: 'rejected',
      });

      try {
        await controller.create(ctx, input);
      } catch (error) {
        expect(error.message).toEqual('rejected');
      }
    });
  });

  describe('Get tags', () => {
    it('should call service method findAll', () => {
      mockedTagService.findAll.mockResolvedValue({
        tags: [],
        meta: null,
      });
      const queryParams: PaginationParamsDto = {
        limit: 100,
        offset: 0,
      };

      controller.findAll(ctx, queryParams);
      expect(mockedTagService.findAll).toHaveBeenCalledWith(
        ctx,
        queryParams.limit,
        queryParams.offset,
      );
    });
  });

  describe('Get tag by id', () => {
    it('should call service method findOne with id', () => {
      const id = uuidv4();

      controller.findOne(ctx, id);
      expect(mockedTagService.findOne).toHaveBeenCalledWith(ctx, id);
    });
  });

  describe('Update tag', () => {
    it('should call tagService.update with correct parameters', () => {
      const tagId = uuidv4();
      const input: UpdateTagInput = {
        title: 'Test',
        color: '#FF0000',
        isActive: true,
      };
      controller.update(ctx, tagId, input);
      expect(mockedTagService.update).toHaveBeenCalledWith(ctx, tagId, input);
    });
  });

  describe('Delete tag', () => {
    it('should call tagService.remove with correct id', () => {
      const tagId = uuidv4();
      controller.remove(ctx, tagId);
      expect(mockedTagService.remove).toHaveBeenCalledWith(ctx, tagId);
    });
  });
});
