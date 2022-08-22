import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/tracing';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { RequestIdMiddleware } from './shared/middlewares/request-id/request-id.middleware';
import { VALIDATION_PIPE_OPTIONS } from './shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.use(compression());

  const configService = app.get(ConfigService);
  Sentry.init({
    dsn: configService.get<string>('sentry.dsn'),
    environment: configService.get<string>('env'),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Integrations.Express(),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.enableCors();

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
