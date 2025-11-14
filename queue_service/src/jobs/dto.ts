import { IsString, IsEmail, IsObject, IsOptional } from "class-validator";

export class UserCreatedEventDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class EmailSendRequestDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, string>;
}

export class ScheduledTaskEventDto {
  @IsString()
  timestamp: string;
}
