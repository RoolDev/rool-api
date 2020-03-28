import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import dotenvFlow = require('dotenv-flow');

async function bootstrap() {
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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
