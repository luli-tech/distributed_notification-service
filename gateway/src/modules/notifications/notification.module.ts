import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getRabbitMqConfig } from '../../config/rabbitmq.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE_QUEUE',
        ...getRabbitMqConfig('email_queue'),
      },
      {
        name: 'PUSH_SERVICE_QUEUE',
        ...getRabbitMqConfig('push_queue'),
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
