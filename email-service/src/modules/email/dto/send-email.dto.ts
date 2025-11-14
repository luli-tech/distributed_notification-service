import { IsEmail, IsNotEmpty, IsString, IsObject } from "class-validator";

export class SendEmailDto {
  recipient: string;
  subject: string;
  template_name: string;
  template_variables: Record<string, any>;
}
