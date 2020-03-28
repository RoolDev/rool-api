import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationError } from 'class-validator';

import dotenvFlow = require('dotenv-flow');

async function bootstrap() {
  const logger = new Logger('bootstrap');

  dotenvFlow.config();

  const app = await NestFactory.create(AppModule);

  // Override ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
      },
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(errors),
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: 'https://habborool.org' });

    logger.log(`Accepting requests from origin "habborool.org"`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
