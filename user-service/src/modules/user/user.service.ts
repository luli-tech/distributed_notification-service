import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password_hash,
        push_token: createUserDto.push_token,
        notifications_enabled: createUserDto.notifications_enabled,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...result } = user;
    return result;
  }

  async find_by_email(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async update_notification_preferences(
    user_id: number,
    notifications_enabled: boolean
  ) {
    const user = await this.prisma.user.update({
      where: { id: user_id },
      data: { notifications_enabled },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...result } = user;
    return result;
  }
}
