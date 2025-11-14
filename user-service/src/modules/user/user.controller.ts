import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ApiResponse } from "../../common/interfaces/api-response.interface"; // Corrected import path

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @SwaggerApiResponse({
    status: 201,
    description: "The user has been successfully created.",
  })
  @SwaggerApiResponse({
    status: 409,
    description: "User with this email already exists.",
  })
  // @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<ApiResponse<any>> {
    const user = await this.userService.create(createUserDto);
    return { success: true, data: user, message: "User created successfully" };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user and get JWT token" })
  @SwaggerApiResponse({
    status: 200,
    description: "User successfully logged in.",
  })
  @SwaggerApiResponse({ status: 401, description: "Invalid credentials." })
  @SwaggerApiResponse({ status: 404, description: "User not found." })
  // @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<ApiResponse<{ access_token: string; user: any }>> {
    const result = await this.userService.login(loginUserDto);
    return {
      success: true,
      data: result,
      message: "User logged in successfully",
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @SwaggerApiResponse({ status: 200, description: "User data retrieved." })
  @SwaggerApiResponse({ status: 404, description: "User not found." })
  @ApiParam({ name: "id", description: "User ID", type: String })
  async find_one(@Param("id") id: string): Promise<ApiResponse<any>> {
    const user = await this.userService.find_one(parseInt(id, 10));
    return {
      success: true,
      data: user,
      message: "User retrieved successfully",
    };
  }

  @Get("email/:email")
  @ApiOperation({ summary: "Get user by email" })
  @SwaggerApiResponse({ status: 200, description: "User data retrieved." })
  @SwaggerApiResponse({ status: 404, description: "User not found." })
  @ApiParam({ name: "email", description: "User email", type: String })
  async find_by_email(
    @Param("email") email: string
  ): Promise<ApiResponse<any>> {
    const user = await this.userService.find_by_email(email);
    return {
      success: true,
      data: user,
      message: "User retrieved successfully",
    };
  }

  @Patch(":id/notification-preferences")
  @ApiOperation({ summary: "Update user notification preferences" })
  @SwaggerApiResponse({
    status: 200,
    description: "Notification preferences updated.",
  })
  @SwaggerApiResponse({ status: 404, description: "User not found." })
  @ApiParam({ name: "id", description: "User ID", type: String })
  // @UsePipes(new ValidationPipe({ transform: true }))
  async update_notification_preferences(
    @Param("id") id: string,
    @Body() updateDto: UpdateNotificationPreferencesDto
  ): Promise<ApiResponse<any>> {
    const user = await this.userService.update_notification_preferences(
      parseInt(id, 10),
      updateDto.notifications_enabled
    );
    return {
      success: true,
      data: user,
      message: "Notification preferences updated successfully",
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a user by ID" })
  @SwaggerApiResponse({
    status: 204,
    description: "User successfully deleted.",
  })
  @SwaggerApiResponse({ status: 404, description: "User not found." })
  @ApiParam({ name: "id", description: "User ID", type: String })
  async delete_user(@Param("id") id: string): Promise<ApiResponse<null>> {
    await this.userService.delete_user(parseInt(id, 10));
    return { success: true, message: "User deleted successfully" };
  }

  @Get("health")
  @ApiOperation({ summary: "Get health status" })
  @SwaggerApiResponse({ status: 200, description: "Returns health status." })
  getHealth(): ApiResponse<{ status: string }> {
    return {
      success: true,
      data: { status: "ok" },
      message: "User service is healthy",
    };
  }
}
