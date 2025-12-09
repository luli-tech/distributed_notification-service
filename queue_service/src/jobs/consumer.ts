import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { validateOrReject } from "class-validator";
import {
  UserCreatedEventDto,
  EmailSendRequestDto,
  ScheduledTaskEventDto,
} from "./dto";
import { retry } from "./retry.util";

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  @EventPattern("user_created")
  async handleUserCreated(data: Record<string, unknown>) {
    this.logger.log("User created event received:", data);
    const dto = Object.assign(new UserCreatedEventDto(), data);
    try {
      await retry(() => validateOrReject(dto), 3, 500);
      // Process user creation event, e.g., send welcome email
    } catch (err) {
      this.logger.error(
        "Validation failed for user_created event after retries",
        err
      );
    }
  }

  @EventPattern("email_send_request")
  async handleEmailSendRequest(data: Record<string, unknown>) {
    this.logger.log("Email send request received:", data);
    const dto = Object.assign(new EmailSendRequestDto(), data);
    try {
      await retry(() => validateOrReject(dto), 3, 500);
      // Process email send request, e.g., add to a sending queue
    } catch (err) {
      this.logger.error(
        "Validation failed for email_send_request event after retries",
        err
      );
    }
  }

  @EventPattern("scheduled_task")
  async handleScheduledTask(data: Record<string, unknown>) {
    this.logger.log("Scheduled task event received:", data);
    const dto = Object.assign(new ScheduledTaskEventDto(), data);
    try {
      await retry(() => validateOrReject(dto), 3, 500);
      this.logger.log("Scheduled task event processed successfully.");
      // Add your business logic for the scheduled task here
    } catch (err) {
      this.logger.error(
        "Validation failed for scheduled_task event after retries",
        err
      );
    }
  }
}
