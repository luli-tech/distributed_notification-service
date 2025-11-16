import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  registerUser(dto: CreateUserDto) {
    return this.userClient.send('register_user', dto);
  }

  loginUser(dto: LoginUserDto) {
    return this.userClient.send('login_user', dto);
  }

  updatePushToken(id: number, push_token?: string) {
    return this.userClient.send('update_push_token', { id, push_token });
  }

  updateNotificationPreferences(id: number, notifications_enabled: boolean) {
    return this.userClient.send('update_notification_preferences', {
      id,
      notifications_enabled,
    });
  }

  getUserById(id: number) {
    return this.userClient.send('get_user_by_id', id);
  }

  getUserByEmail(email: string) {
    return this.userClient.send('get_user_by_email', email);
  }

  deleteUser(id: number) {
    return this.userClient.send('delete_user', id);
  }

  health() {
    return this.userClient.send('health_user_service', {});
  }
}
