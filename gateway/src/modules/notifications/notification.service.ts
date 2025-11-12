import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service'; // Import RedisService

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly NOTIFICATION_STATUS_PREFIX = 'notification:status:';

  constructor(
    @Inject('EMAIL_SERVICE_QUEUE') private emailClient: ClientProxy,
    @Inject('PUSH_SERVICE_QUEUE') private pushClient: ClientProxy,
    @Inject('USER_SERVICE') private userServiceClient: ClientProxy,
    private readonly redisService: RedisService, // Inject RedisService
  ) {}

  async sendEmailNotification(data: any, user_id: string) {
    // Idempotency: Use request_id if provided, else generate
    const notification_id =
      data.request_id ||
      `email-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `Sending 'send_email_notification' event with data: ${JSON.stringify(data)} for user: ${user_id}, notification_id: ${notification_id}`,
    );
    let attempts = 0;
    const maxAttempts = 3;
    let sent = false;
    let error = null;
    while (attempts < maxAttempts && !sent) {
      try {
        await this.emailClient.emit('send_email_notification', {
          ...data,
          user_id,
          notification_id,
        });
        sent = true;
      } catch (err) {
        attempts++;
        error = err.message || 'Failed to send email notification';
        this.logger.error(
          `Email notification send failed (attempt ${attempts}): ${error}`,
        );
        // Circuit breaker: break if max attempts reached
        if (attempts >= maxAttempts) {
          // Dead-letter queue: emit to failed.queue
          await this.emailClient.emit('failed.queue', {
            ...data,
            user_id,
            notification_id,
            error,
          });
          await this.updateNotificationStatus(
            notification_id,
            'failed',
            user_id,
          );
          return {
            success: false,
            error,
            message: 'Email notification failed',
            data: null,
          };
        }
      }
    }
    await this.updateNotificationStatus(notification_id, 'queued', user_id);
    return {
      success: true,
      error: null,
      message: 'Email notification sent to queue',
      data: null,
    };
  }

  async sendPushNotification(data: any, user_id: string) {
    // Idempotency: Use request_id if provided, else generate
    const notification_id =
      data.request_id ||
      `push-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.logger.log(
      `Sending 'send_push_notification' event with data: ${JSON.stringify(data)} for user: ${user_id}, notification_id: ${notification_id}`,
    );
    let attempts = 0;
    const maxAttempts = 3;
    let sent = false;
    let error = null;
    while (attempts < maxAttempts && !sent) {
      try {
        await this.pushClient.emit('send_push_notification', {
          ...data,
          user_id,
          notification_id,
        });
        sent = true;
      } catch (err) {
        attempts++;
        error = err.message || 'Failed to send push notification';
        this.logger.error(
          `Push notification send failed (attempt ${attempts}): ${error}`,
        );
        // Circuit breaker: break if max attempts reached
        if (attempts >= maxAttempts) {
          // Dead-letter queue: emit to failed.queue
          await this.pushClient.emit('failed.queue', {
            ...data,
            user_id,
            notification_id,
            error,
          });
          await this.updateNotificationStatus(
            notification_id,
            'failed',
            user_id,
          );
          return {
            success: false,
            error,
            message: 'Push notification failed',
            data: null,
          };
        }
      }
    }
    await this.updateNotificationStatus(notification_id, 'queued', user_id);
    return {
      success: true,
      error: null,
      message: 'Push notification sent to queue',
      data: null,
    };
  }

  async updateNotificationStatus(
    notification_id: string,
    status: string,
    user_id: string,
  ): Promise<void> {
    const key = `${this.NOTIFICATION_STATUS_PREFIX}${notification_id}`;
    const value = JSON.stringify({
      status,
      user_id,
      timestamp: new Date().toISOString(),
    });
    await this.redisService.set(key, value, 3600); // Store for 1 hour
    this.logger.log(
      `Notification ${notification_id} status updated to: ${status} in Redis`,
    );
  }

  async getNotificationStatus(notification_id: string): Promise<string | null> {
    const key = `${this.NOTIFICATION_STATUS_PREFIX}${notification_id}`;
    const storedData = await this.redisService.get(key);
    if (storedData) {
      const { status } = JSON.parse(storedData);
      return status;
    }
    return null;
  }
}
