import { RmqOptions, Transport } from "@nestjs/microservices";

export const getRabbitMqConfig = (queue: string): RmqOptions => {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
      queue: queue,
      queueOptions: {
        durable: false,
      },
    },
  };
};
