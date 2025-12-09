import { IsBoolean, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNotificationPreferencesDto {
  @ApiProperty({
    example: true,
    description: "Whether user notifications are enabled",
  })
  @IsBoolean()
  @IsNotEmpty()
  notifications_enabled: boolean;
}
