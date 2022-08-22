import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../services/mail.service';
import { MailController } from './mail.controller';
import { AppLogger } from '../../shared/logger/logger.service';
import { ContactInput } from '../dto/contact-input.dto';
import { RequestContext } from '../../shared/request-context/request-context.dto';

describe('MailController', () => {
  let controller: MailController;
  const mockedMailService = {
    sendContactMessage: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        { provide: MailService, useValue: mockedMailService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('sendContactMessage', () => {
    it('should send contact message', async () => {
      const input: ContactInput = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '123123',
      };

      controller.sendContactMessage(ctx, input);
      expect(mockedMailService.sendContactMessage).toHaveBeenCalledWith(
        ctx,
        input,
      );
    });
  });
});
