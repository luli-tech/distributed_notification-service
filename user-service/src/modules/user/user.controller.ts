import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePreferenceDto } from './dto/update-preferences.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return { success: true, data: user, message: 'User created successfully' };
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const user = await this.userService.login(dto);
    if (!user) return { success: false, message: 'Invalid credentials' };
    return { success: true, data: user, message: 'Login successful' };
  }

  @Patch(':id/preferences')
  async updatePreferences(
    @Param('id') id: string,
    @Body() dto: UpdatePreferenceDto,
  ) {
    const prefs = await this.userService.updatePreferences(id, dto);
    return { success: true, data: prefs, message: 'Preferences updated' };
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUser(id);
    return { success: true, data: user, message: 'User fetched successfully' };
  }
}
