import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { getRabbitMqConfig } from "./config/rabbitmq.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    getRabbitMqConfig("user_queue")
  );
  await microservice.listen();
}
bootstrap();
