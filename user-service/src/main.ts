import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { getRabbitMqConfig } from "./config/rabbitmq.config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const rabbitMqConfig = getRabbitMqConfig("user_queue");
  app.connectMicroservice<MicroserviceOptions>(rabbitMqConfig);

  const config = new DocumentBuilder()
    .setTitle("User Service API")
    .setDescription("API documentation for the User Service")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT ?? 3001;
  await app.startAllMicroservices();
  await app.listen(port);

  const rabbitMqUrl = (rabbitMqConfig.options as any).urls[0];
  Logger.log(
    `User service is running on: http://localhost:${port}/api`,
    "Bootstrap"
  );
  Logger.log(
    `User service connected to RabbitMQ at: ${rabbitMqUrl} on queue: user_queue`,
    "Bootstrap"
  );
  Logger.log(
    `Swagger documentation available at: http://localhost:${port}/api-docs`,
    "Bootstrap"
  );
}
bootstrap();
