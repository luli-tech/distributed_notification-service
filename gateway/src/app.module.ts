import { Module, Logger, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRabbitMqConfig } from './config/rabbitmq.config';
import { NotificationsModule } from './modules/notifications/notification.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './modules/redis/redis.module'; // Import RedisModule
import { Request, Response, NextFunction } from 'express'; // Import Request from express

const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
Logger.log(`RabbitMQ URL: ${rabbitMqUrl}`, 'AppModule');

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
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
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './infra/env/gateway-service.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        // This is a global middleware, useful for logging or other cross-cutting concerns
        // For authentication, we're using a guard, but this demonstrates middleware usage
        next();
      })
      .forRoutes('*');
  }
}
