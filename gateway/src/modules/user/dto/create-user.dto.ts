import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'some_push_token_string',
    description: "User's push notification token",
    required: false,
  })
  @IsOptional()
  @IsString()
  push_token?: string;

  @ApiProperty({
    example: true,
    description: 'Whether user notifications are enabled',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notifications_enabled?: boolean;
}
