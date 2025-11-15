import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRabbitMqConfig } from '../../config/rabbitmq.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...getRabbitMqConfig('user_queue'),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
