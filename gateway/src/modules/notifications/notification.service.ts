import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject('NOTIFICATION_SERVICE') private client: ClientProxy,
    @Inject('USER_SERVICE') private userServiceClient: ClientProxy, // Inject User Service client
  ) {}

  async sendEmailNotification(data: any, user_id: string) {
    const notification_id = `email-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `Sending 'send_email_notification' event with data: ${JSON.stringify(data)} for user: ${user_id}, notification_id: ${notification_id}`,
    );
    this.client.emit('send_email_notification', {
      ...data,
      user_id,
      notification_id,
    });
    // In a real scenario, you'd store the status in a database
    // For now, we'll mock a status store
    this.updateNotificationStatus(notification_id, 'queued', user_id);
  }

  async sendPushNotification(data: any, user_id: string) {
    const notification_id = `push-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `Sending 'send_push_notification' event with data: ${JSON.stringify(data)} for user: ${user_id}, notification_id: ${notification_id}`,
    );
    this.client.emit('send_push_notification', {
      ...data,
      user_id,
      notification_id,
    });
    // In a real scenario, you'd store the status in a database
    // For now, we'll mock a status store
    this.updateNotificationStatus(notification_id, 'queued', user_id);
  }

  // Mock status store
  private notification_statuses: Record<
    string,
    { status: string; user_id: string }
  > = {};

  async updateNotificationStatus(
    notification_id: string,
    status: string,
    user_id: string,
  ) {
    this.notification_statuses[notification_id] = { status, user_id };
    this.logger.log(
      `Notification ${notification_id} status updated to: ${status}`,
    );
  }

  async getNotificationStatus(notification_id: string): Promise<string | null> {
    return this.notification_statuses[notification_id]?.status || null;
  }
}
