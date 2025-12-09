import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdatePushTokenDto } from "./dto/update-push-token.dto";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /** Create a new user */
  @MessagePattern("register_user")
  async registerUser(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /** Login user */
  @MessagePattern("login_user")
  async loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  /** Update user push token */
  @MessagePattern("update_push_token")
  async updatePushToken(@Payload() data: { id: number; push_token?: string }) {
    return this.userService.updatePushToken(data.id, data.push_token);
  }

  /** Update notification preferences */
  @MessagePattern("update_notification_preferences")
  async updateNotificationPreferences(
    @Payload() data: { id: number; notifications_enabled: boolean }
  ) {
    return this.userService.update_notification_preferences(
      data.id,
      data.notifications_enabled
    );
  }

  /** Get user by ID */
  @MessagePattern("get_user_by_id")
  async getUserById(@Payload() id: number) {
    return this.userService.find_one(id);
  }

  /** Get user by email */
  @MessagePattern("get_user_by_email")
  async getUserByEmail(@Payload() email: string) {
    return this.userService.find_by_email(email);
  }

  /** Delete user by ID */
  @MessagePattern("delete_user")
  async deleteUser(@Payload() id: number) {
    return this.userService.delete_user(id);
  }

  /** Update push token via DTO */
  @MessagePattern("update_push_token_dto")
  async updatePushTokenDto(
    @Payload() data: { id: number; dto: UpdatePushTokenDto }
  ) {
    return this.userService.updatePushToken(data.id, data.dto.push_token);
  }

  /** Health check */
  @MessagePattern("health_user_service")
  async health() {
    return { status: "ok" };
  }
}
