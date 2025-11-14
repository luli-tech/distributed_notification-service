import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto"; // Import LoginUserDto
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"; // Import jsonwebtoken

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
        // push_token: createUserDto.push_token,
        notifications_enabled: createUserDto.notifications_enabled,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...result } = user;
    return result;
  }

  async find_one(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...result } = user;
    return result;
  }

  async find_by_email(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...result } = user;
    return result;
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

  async delete_user(id: number) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        notifications_enabled: user.notifications_enabled,
      },
    };
  }

  async get_notification_preferences(user_id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return { notifications_enabled: user.notifications_enabled };
  }
}
