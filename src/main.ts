import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';

import { ValidationError } from 'class-validator';
import dotenvFlow = require('dotenv-flow');

import * as rateLimit from 'express-rate-limit';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  dotenvFlow.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
    app.use(cors());

    // Added rate
    app.use(
      rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );

    // Enable proxy
    app.set('trust proxy', 1);

    logger.log(`Accepting requests from origin "habborool.org"`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
