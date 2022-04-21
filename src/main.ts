import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as mongoose from 'mongoose';

async function bootstrap() {
  // Debug to see the mongoose requests.
  mongoose.set('debug', true);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableDebugMessages: true,
    }),
  );
  await app.listen(3000);
}

bootstrap();
