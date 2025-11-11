import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() data: any) {
    this.notificationService.sendNotification(data);
    return { message: 'Notification sent to queue' };
  }
}
