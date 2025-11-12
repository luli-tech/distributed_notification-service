import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { getRabbitMqConfig } from "./config/rabbitmq.config";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const rabbitMqConfig = getRabbitMqConfig("user_queue");
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    rabbitMqConfig
  );
  await app.listen();
  const rabbitMqUrl = (rabbitMqConfig.options as any).urls[0];
  Logger.log(
    `User service connected to RabbitMQ at: ${rabbitMqUrl} on queue: user_queue`,
    "Bootstrap"
  );
}
bootstrap();
