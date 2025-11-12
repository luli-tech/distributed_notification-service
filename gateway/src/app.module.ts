import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRabbitMqConfig } from './config/rabbitmq.config';
import { NotificationsModule } from './modules/notifications/notification.module';
import { UserModule } from './modules/user/user.module';

const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
Logger.log(`RabbitMQ URL: ${rabbitMqUrl}`, 'AppModule');

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
      {
        name: 'PUSH_SERVICE',
        ...getRabbitMqConfig('push_queue'),
      },
    ]),
    NotificationsModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './infra/env/gateway-service.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
