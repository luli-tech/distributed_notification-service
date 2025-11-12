import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(@Inject('NOTIFICATION_SERVICE') private client: ClientProxy) {}

  async sendEmailNotification(data: any) {
    this.logger.log(
      `Sending 'send_email_notification' event with data: ${JSON.stringify(data)}`,
    );
    this.client.emit('send_email_notification', data);
  }

  async sendPushNotification(data: any) {
    this.logger.log(
      `Sending 'send_push_notification' event with data: ${JSON.stringify(data)}`,
    );
    this.client.emit('send_push_notification', data);
  }
}
