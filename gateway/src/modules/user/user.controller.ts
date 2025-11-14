import { Controller, Post, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { Request } from 'express';
import { ApiResponse as SwaggerApiResponse, ApiParam } from '@nestjs/swagger';
import {
  UseGuards,
  Patch,
  Req,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Patch(':id/push-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user push token' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Push token updated.',
  })
  @SwaggerApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePushToken(
    @Param('id') id: string,
    @Body() updatePushTokenDto: UpdatePushTokenDto,
    @Req() req: Request,
  ) {
    const user_id = (req.user as any).userId;
    return this.userServiceClient.send('update_push_token', {
      id: parseInt(id, 10),
      push_token: updatePushTokenDto.push_token,
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userServiceClient.send('register_user', createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userServiceClient.send('login_user', loginUserDto);
  }
}
