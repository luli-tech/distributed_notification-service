import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { getRabbitMqConfig } from "./config/rabbitmq.config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const microservice = app.connectMicroservice<MicroserviceOptions>(
    getRabbitMqConfig("email_queue")
  );

  const config = new DocumentBuilder()
    .setTitle("Email Service")
    .setDescription("The Email Service API description")
    .setVersion("1.0")
    .addTag("email")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3002); // HTTP listener for health checks
  await microservice.listen();

  const rabbitMqUrl = (getRabbitMqConfig("email_queue").options as any).urls[0];
  Logger.log(`Email service HTTP listener running on port 3002`, "Bootstrap");
  Logger.log(
    `Email service connected to RabbitMQ at: ${rabbitMqUrl} on queue: email_queue`,
    "Bootstrap"
  );
}
bootstrap();
