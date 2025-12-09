import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "RABBITMQ_SERVICE",
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>(
                "RABBITMQ_USER"
              )}:${configService.get<string>(
                "RABBITMQ_PASSWORD"
              )}@${configService.get<string>(
                "RABBITMQ_HOST"
              )}:${configService.get<string>("RABBITMQ_PORT")}`,
            ],
            queue: configService.get<string>("RABBITMQ_QUEUE_NAME"),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQConfigModule {}
