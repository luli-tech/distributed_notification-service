import { IsEmail, IsNotEmpty, IsString, IsObject } from "class-validator";

export class ProcessEmailDto {
  @IsString()
  @IsNotEmpty()
  notification_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsEmail()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  template_name: string;

  @IsObject()
  template_variables: Record<string, any>;
}
