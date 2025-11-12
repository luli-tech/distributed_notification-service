import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(":email")
  async find_by_email(@Param("email") email: string) {
    return this.userService.find_by_email(email);
  }

  @Patch(":id/notification-preferences")
  @UsePipes(new ValidationPipe({ transform: true }))
  async update_notification_preferences(
    @Param("id") id: string,
    @Body() updateDto: UpdateNotificationPreferencesDto
  ) {
    return this.userService.update_notification_preferences(
      parseInt(id, 10),
      updateDto.notifications_enabled
    );
  }
}
