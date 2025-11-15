import { IsString, IsEmail, IsObject, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserCreatedEventDto {
  @ApiProperty({
    example: "uuid-of-user",
    description: "Unique ID of the user",
  })
  @IsString()
  id: string;

  @ApiProperty({ example: "test@example.com", description: "User email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe", description: "User name" })
  @IsString()
  name: string;
}

export class EmailSendRequestDto {
  @ApiProperty({
    example: "test@example.com",
    description: "Recipient email address",
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    example: "Welcome to our service!",
    description: "Email subject",
  })
  @IsString()
  subject: string;

  @ApiProperty({
    example: "<h1>Hello {{name}}</h1>",
    description: "Email body content",
  })
  @IsString()
  body: string;

  @ApiProperty({
    example: { name: "John Doe" },
    description: "Variables to be used in the email template",
    required: false,
  })
  @IsObject()
  @IsOptional()
  variables?: Record<string, string>;
}

export class ScheduledTaskEventDto {
  @ApiProperty({
    example: "2025-12-31T23:59:59Z",
    description: "Timestamp of the scheduled task",
  })
  @IsString()
  timestamp: string;
}
