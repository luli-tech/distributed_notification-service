import { IsString, IsNotEmpty, IsOptional, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendPushDto {
  @ApiProperty({
    example: "uuid-of-request",
    description: "Unique ID for the push notification request",
  })
  @IsString()
  @IsNotEmpty()
  request_id: string;

  @ApiProperty({
    example: "device_token_string",
    description: "Device token for push notification",
  })
  @IsString()
  @IsNotEmpty()
  device_token: string;

  @ApiProperty({
    example: "Notification Title",
    description: "Title of the push notification",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "Notification Body",
    description: "Body of the push notification",
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    example: "https://example.com/image.png",
    description: "Optional image URL for the notification",
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: "https://example.com/link",
    description: "Optional deep link for the notification",
    required: false,
  })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({
    example: { key: "value" },
    description: "Optional additional data for the notification",
    required: false,
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
