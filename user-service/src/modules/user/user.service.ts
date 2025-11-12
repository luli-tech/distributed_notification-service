import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePreferenceDto } from './dto/update-preferences.dto';
import * as bcrypt from 'bcryptjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  // Create a new user
  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        pushToken: dto.pushToken, // fixed property name
        preferences: dto.preferences
          ? {
              create: {
                email: dto.preferences.email,
                push: dto.preferences.push,
              },
            }
          : {
              // optional default preferences
              create: {
                email: true,
                push: true,
              },
            },
      },
      include: { preferences: true }, 
    });

    this.userClient.emit('user.created', { user_id: user.id, email: user.email });

    return user;
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { preferences: true },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) return null;

    return user;
  }
  async updatePreferences(userId: string, dto: UpdatePreferenceDto) {
    const existingPref = await this.prisma.userPreference.findFirst({
      where: { userId },
    });

    if (!existingPref) {
      return this.prisma.userPreference.create({
        data: {
          userId,
          email: dto.email,
          push: dto.push,
        },
      });
    }

    return this.prisma.userPreference.update({
      where: { id: existingPref.id },
      data: dto,
    });
  }
  async getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });
  }
}
