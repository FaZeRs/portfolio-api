import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { LinkController } from './link.controller';
import { LinkService } from '../services/link.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateLinkInput, UpdateLinkInput } from '../dto/link-input.dto';
import { LinkOutput } from '../dto/link-output.dto';
import { PaginationParamsDto } from '../../shared/dto/pagination-params.dto';

describe('LinkController', () => {
  let controller: LinkController;
  const mockedLinkService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [LinkController],
      providers: [
        { provide: LinkService, useValue: mockedLinkService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = moduleRef.get<LinkController>(LinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create link', () => {
    let input: CreateLinkInput;

    beforeEach(() => {
      input = {
        title: 'Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };
    });

    const projectId = uuidv4();

    it('should call linkService.create with correct input', () => {
      controller.create(ctx, projectId, input);
      expect(mockedLinkService.create).toHaveBeenCalledWith(
        ctx,
        projectId,
        input,
      );
    });

    it('should return data which includes info from linkService.create', async () => {
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

      mockedLinkService.create.mockResolvedValue(expectedOutput);

      expect(await controller.create(ctx, projectId, input)).toEqual({
        data: expectedOutput,
        meta: {},
      });
    });

    it('should throw error when linkService.create throws an error', async () => {
      mockedLinkService.create.mockRejectedValue({
        message: 'rejected',
      });

      try {
        await controller.create(ctx, projectId, input);
      } catch (error) {
        expect(error.message).toEqual('rejected');
      }
    });
  });

  describe('Get links', () => {
    it('should call service method findAll', () => {
      mockedLinkService.findAll.mockResolvedValue({
        links: [],
        meta: null,
      });
      const queryParams: PaginationParamsDto = {
        limit: 100,
        offset: 0,
      };
      const projectId = uuidv4();

      controller.findAll(ctx, projectId, queryParams);
      expect(mockedLinkService.findAll).toHaveBeenCalledWith(
        ctx,
        projectId,
        queryParams.limit,
        queryParams.offset,
      );
    });
  });

  describe('Get link by id', () => {
    it('should call service method findOne with id', () => {
      const id = uuidv4();

      controller.findOne(ctx, id);
      expect(mockedLinkService.findOne).toHaveBeenCalledWith(ctx, id);
    });
  });

  describe('Update link', () => {
    it('should call linkService.updateLink with correct parameters', () => {
      const linkId = uuidv4();
      const input: UpdateLinkInput = {
        title: 'Test',
        url: 'https://test.com',
        icon: 'mdi-github',
        isActive: true,
      };
      controller.update(ctx, linkId, input);
      expect(mockedLinkService.update).toHaveBeenCalledWith(ctx, linkId, input);
    });
  });

  describe('Delete link', () => {
    it('should call linkService.remove with correct id', () => {
      const linkId = uuidv4();
      controller.remove(ctx, linkId);
      expect(mockedLinkService.remove).toHaveBeenCalledWith(ctx, linkId);
    });
  });
});
