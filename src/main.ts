import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //permet de supprimer automatiquement les paramètres non voulus lors des requêtes POST
      transform: true, //permet de transformer automatiquement les données reçues en POST comme des instances de la DTO
      // forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  //app.useGlobalGuards(new ApiKeyGuard());
  await app.listen(3000);
}
bootstrap();
