import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePushTokenDto {
  @ApiProperty({
    example: "new_push_token_string",
    description: "New push notification token for the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  push_token?: string;
}
