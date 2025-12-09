import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Distributed Notification Service API Gateway')
    .setDescription(
      'API documentation for the Distributed Notification Service Gateway',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(
    `Gateway service is running on: http://localhost:${port}/api`,
    'Bootstrap',
  );
  Logger.log(
    `Swagger documentation available at: http://localhost:${port}/api-docs`,
    'Bootstrap',
  );
}
bootstrap();
