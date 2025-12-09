import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @UsePipes(new ValidationPipe({ transform: true }))
  register(@Body() dto: CreateUserDto) {
    return this.userService.registerUser(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() dto: LoginUserDto) {
    return this.userService.loginUser(dto);
  }

  @Patch(':id/push-token')
  @ApiOperation({ summary: 'Update user push token' })
  @ApiResponse({ status: 200, description: 'Push token updated' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @UsePipes(new ValidationPipe({ transform: true }))
  updatePushToken(@Param('id') id: string, @Body() dto: UpdatePushTokenDto) {
    return this.userService.updatePushToken(parseInt(id, 10), dto.push_token);
  }

  @Patch(':id/notification-preferences')
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences updated' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @UsePipes(new ValidationPipe({ transform: true }))
  updateNotificationPreferences(
    @Param('id') id: string,
    @Body() body: { notifications_enabled: boolean },
  ) {
    return this.userService.updateNotificationPreferences(
      parseInt(id, 10),
      body.notifications_enabled,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiParam({ name: 'id', description: 'User ID' })
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(parseInt(id, 10));
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiParam({ name: 'email', description: 'User email' })
  getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiParam({ name: 'id', description: 'User ID' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(parseInt(id, 10));
  }

  @Get('health')
  @ApiOperation({ summary: 'Check user service health' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return this.userService.health();
  }
}
