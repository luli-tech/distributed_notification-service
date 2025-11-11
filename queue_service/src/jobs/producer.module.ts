import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { getRabbitMqConfig } from "../config/rabbitmq.config";
import { ProducerService } from "./producer";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "QUEUE_SERVICE",
        ...getRabbitMqConfig("queue_service_queue"),
      },
    ]),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
