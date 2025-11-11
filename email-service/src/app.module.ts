import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRabbitMqConfig } from './config/rabbitmq.config';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        ...getRabbitMqConfig('email_queue'),
      },
    ]),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
