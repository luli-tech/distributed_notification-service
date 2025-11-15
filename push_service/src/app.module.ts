import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PushController } from "./modules/push.controller";
import { PushService } from "./modules/push.service";
import { ConfigModule } from "@nestjs/config";
import { RabbitMQConfigModule } from "./config/rabbitmq.config";

@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./infra/env/push-service.env",
    }),
    RabbitMQConfigModule,
  ],
  controllers: [AppController, PushController],
  providers: [AppService, PushService],
})
export class AppModule {}
