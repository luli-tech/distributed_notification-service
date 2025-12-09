import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Push Service")
    .setDescription("The Push Service API description")
    .setVersion("1.0")
    .addTag("push")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3003);

  Logger.log(`Push service HTTP listener running on port 3003`, "Bootstrap");
  Logger.log(
    `Swagger documentation available at: http://localhost:3003/api`,
    "Bootstrap"
  );
}
bootstrap();
