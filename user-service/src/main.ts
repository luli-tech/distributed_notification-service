import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { getRabbitMqConfig } from "./config/rabbitmq.config";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    getRabbitMqConfig("user_queue")
  );
  await app.listen();
}
bootstrap();
