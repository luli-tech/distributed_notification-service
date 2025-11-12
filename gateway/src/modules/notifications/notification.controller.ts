import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendPushDto } from './dto/send-push.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendEmailNotification(
    @Body() sendEmailDto: SendEmailDto,
    @Req() req: Request,
  ) {
    const user_id = (req.user as any).userId;
    this.notificationService.sendEmailNotification(sendEmailDto, user_id);
    return { success: true, message: 'Email notification sent to queue' };
  }

  @Post('push')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendPushNotification(
    @Body() sendPushDto: SendPushDto,
    @Req() req: Request,
  ) {
    const user_id = (req.user as any).userId;
    this.notificationService.sendPushNotification(sendPushDto, user_id);
    return { success: true, message: 'Push notification sent to queue' };
  }

  @Get(':id/status')
  async getNotificationStatus(@Param('id') id: string) {
    const status = await this.notificationService.getNotificationStatus(id);
    return {
      success: true,
      data: { status },
      message: 'Notification status retrieved',
    };
  }
}
