import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRabbitMqConfig } from './config/rabbitmq.config';
import { NotificationsModule } from './modules/notifications/notification.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        ...getRabbitMqConfig('notification_queue'),
      },
      {
        name: 'USER_SERVICE',
        ...getRabbitMqConfig('user_queue'),
      },
      {
        name: 'EMAIL_SERVICE',
        ...getRabbitMqConfig('email_queue'),
      },
    ]),
    NotificationsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
