import { Module, Logger, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisModule } from '@nestjs/throttler-storage-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRabbitMqConfig } from './config/rabbitmq.config';
import { NotificationsModule } from './modules/notifications/notification.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './modules/redis/redis.module';
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
Logger.log(`RabbitMQ URL: ${rabbitMqUrl}`, 'AppModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './infra/env/gateway.env',
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().allow('').optional(),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: 60,
        limit: 20,
        storage: new ThrottlerStorageRedisModule({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        }),
      }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        next();
      })
      .forRoutes('*');
  }
}
