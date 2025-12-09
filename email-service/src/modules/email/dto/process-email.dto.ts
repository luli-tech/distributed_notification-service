import { IsEmail, IsNotEmpty, IsString, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ProcessEmailDto {
  @ApiProperty({
    example: "uuid-of-notification",
    description: "Unique ID of the notification",
  })
  @IsString()
  @IsNotEmpty()
  notification_id: string;

  @ApiProperty({ example: "uuid-of-user", description: "ID of the user" })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    example: "test@example.com",
    description: "Recipient email address",
  })
  @IsEmail()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty({
    example: "Welcome to our service!",
    description: "Email subject",
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: "welcome_template",
    description: "Name of the email template to use",
  })
  @IsString()
  @IsNotEmpty()
  template_name: string;

  @ApiProperty({
    example: { name: "John Doe", appName: "My App" },
    description: "Variables to be used in the email template",
  })
  @IsObject()
  template_variables: Record<string, any>;
}
