import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { ClientsModule } from "@nestjs/microservices";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config"; // Import ConfigModule
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getRabbitMqConfig } from "./config/rabbitmq.config";
import { EmailModule } from "./modules/email/email.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
    ClientsModule.register([
      {
        name: "EMAIL_SERVICE",
        ...getRabbitMqConfig("email_queue"),
      },
    ]),
    EmailModule,
    TerminusModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./infra/env/email-service.env",
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
