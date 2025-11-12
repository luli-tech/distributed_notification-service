import {
  Controller,
  Post,
  Body,
  Inject,
  Logger,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PushService } from "./push.service";
import { SendPushDto } from "./dto/send-push.dto";

@Controller("push")
export class PushController {
  private readonly logger = new Logger(PushController.name);

  constructor(
    private readonly pushService: PushService,
    @Inject("RABBITMQ_SERVICE") private readonly rabbitClient: ClientProxy
  ) {}

  @Post("send")
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendPush(@Body() sendPushDto: SendPushDto) {
    // Idempotency: Use unique request_id
    const requestId = sendPushDto.request_id;
    // Publish to RabbitMQ
    await this.rabbitClient.emit("push.queue", {
      ...sendPushDto,
      request_id: requestId,
    });
    this.logger.log(
      `Push notification enqueued: ${JSON.stringify(sendPushDto)}`
    );

    // Performance: Circuit breaker, retry, dead-letter queue (simplified)
    let status = "pending";
    let error = null;
    try {
      // Simulate sending notification (would be done by consumer in real system)
      const result = await this.pushService.sendPushNotification(sendPushDto);
      status = result ? "sent" : "failed";
    } catch (err) {
      error = err.message || "Failed to send push notification";
      status = "failed";
      // TODO: Move to dead-letter queue if permanently failed
    }
    // TODO: Implement retry logic and circuit breaker (use libraries like opossum for advanced)
    // TODO: Track status in Redis/DB for idempotency and status queries
    return {
      success: status === "sent",
      data: { status },
      error,
      message:
        status === "sent"
          ? "Push notification sent"
          : "Push notification failed",
      meta: null,
    };
  }

  @Get(":id/status")
  async getPushStatus(@Param("id") id: string) {
    // TODO: Implement status tracki
    return {
      success: true,
      data: { status: "pending" },
      error: null,
      message: "Push notification status fetched",
      meta: null,
    };
  }
}
