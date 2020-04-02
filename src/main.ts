import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';

import { ValidationError } from 'class-validator';
import dotenvFlow = require('dotenv-flow');

import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { Request } from 'express';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  dotenvFlow.config();

  if (!process.env.RE_SECRET)
    throw new Error('API will not work if there is no RE_SECRET env var.');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable proxy
  app.set('trust proxy', true);

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
    app.enableCors({
      origin: [
        'http://habborool.org',
        'https://habborool.org',
        'http://localhost:3000',
        '*',
      ],
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
    });

    // Added rate
    app.use(
      rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 1000, // limit each IP to 100 requests per windowMs
        keyGenerator: (req: Request) => {
          return req.headers['cf-connecting-ip'] || req.ip;
        },
      }),
    );

    logger.log(`Accepting requests from origin "habborool.org"`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
