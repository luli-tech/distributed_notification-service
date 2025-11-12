import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { RabbitMQConfigModule } from "./config/rabbitmq.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./infra/env/push-service.env",
    }),
    RabbitMQConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
