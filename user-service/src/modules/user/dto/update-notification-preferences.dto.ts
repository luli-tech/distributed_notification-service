import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateNotificationPreferencesDto {
  @IsBoolean()
  @IsNotEmpty()
  notifications_enabled: boolean;
}
