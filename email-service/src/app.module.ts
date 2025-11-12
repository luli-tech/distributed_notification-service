import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getRabbitMqConfig } from "./config/rabbitmq.config";
import { EmailModule } from "./modules/email/email.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "EMAIL_SERVICE",
        ...getRabbitMqConfig("email_queue"),
      },
    ]),
    EmailModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
