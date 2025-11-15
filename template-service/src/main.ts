import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Template Service')
    .setDescription('The Template Service API description')
    .setVersion('1.0')
    .addTag('templates')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3004);

  Logger.log(
    `Template service HTTP listener running on port ${process.env.PORT ?? 3004}`,
    'Bootstrap',
  );
  Logger.log(
    `Swagger documentation available at: http://localhost:${process.env.PORT ?? 3004}/api`,
    'Bootstrap',
  );
}
bootstrap();
