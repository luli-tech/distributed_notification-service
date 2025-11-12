import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendPushDto } from './dto/send-push.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendEmailNotification(@Body() sendEmailDto: SendEmailDto) {
    this.notificationService.sendEmailNotification(sendEmailDto);
    return { success: true, message: 'Email notification sent to queue' };
  }

  @Post('push')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendPushNotification(@Body() sendPushDto: SendPushDto) {
    this.notificationService.sendPushNotification(sendPushDto);
    return { success: true, message: 'Push notification sent to queue' };
  }
}
