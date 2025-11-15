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
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
} from "@nestjs/swagger"; // New import
import { PushService } from "./push.service";
import { SendPushDto } from "./dto/send-push.dto";

@ApiTags("Push") // Add ApiTags decorator
@Controller("push")
export class PushController {
  private readonly logger = new Logger(PushController.name);

  constructor(
    private readonly pushService: PushService,
    @Inject("RABBITMQ_SERVICE") private readonly rabbitClient: ClientProxy
  ) {}

  @Post("send")
  @ApiOperation({ summary: "Send a push notification" }) // Add ApiOperation decorator
  @SwaggerApiResponse({
    status: 201,
    description: "Push notification enqueued.",
  })
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

    // The actual sending will be handled by a consumer listening to the RabbitMQ queue.
    // This controller only enqueues the message.
    return {
      success: true,
      data: { status: "queued" },
      error: null,
      message: "Push notification enqueued successfully",
      meta: null,
    };
  }

  @Get(":id/status")
  @ApiOperation({ summary: "Get push notification status" }) // Add ApiOperation decorator
  @SwaggerApiResponse({
    status: 200,
    description: "Push notification status retrieved.",
  })
  @SwaggerApiResponse({ status: 404, description: "Notification not found." })
  @ApiParam({ name: "id", description: "Notification ID", type: String }) // Add ApiParam decorator
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
