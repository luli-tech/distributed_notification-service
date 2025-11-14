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
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendPushDto } from './dto/send-push.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { Request } from 'express';
import { ApiResponse } from '../../common/interfaces/response.interface';

@ApiTags('Notifications')
// @UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email')
  @ApiOperation({ summary: 'Send email notification' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Email notification sent to queue.',
  })
  // @UsePipes(new ValidationPipe({ transform: true }))
  async sendEmailNotification(
    @Body() sendEmailDto: SendEmailDto,
    @Req() req: Request,
  ): Promise<ApiResponse<null>> {
    const user_id = (req.user as any).userId;
    this.notificationService.sendEmailNotification(sendEmailDto, user_id);
    return { success: true, message: 'Email notification sent to queue' };
  }

  @Post('push')
  @ApiOperation({ summary: 'Send push notification' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Push notification sent to queue.',
  })
  // @UsePipes(new ValidationPipe({ transform: true }))
  async sendPushNotification(
    @Body() sendPushDto: SendPushDto,
    @Req() req: Request,
  ): Promise<ApiResponse<null>> {
    const user_id = (req.user as any).userId;
    this.notificationService.sendPushNotification(sendPushDto, user_id);
    return { success: true, message: 'Push notification sent to queue' };
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get notification status' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Notification status retrieved.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Notification not found.' })
  async getNotificationStatus(
    @Param('id') id: string,
  ): Promise<ApiResponse<{ status: string }>> {
    const status = await this.notificationService.getNotificationStatus(id);
    if (!status) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }
    return {
      success: true,
      data: { status },
      message: 'Notification status retrieved',
    };
  }
}
