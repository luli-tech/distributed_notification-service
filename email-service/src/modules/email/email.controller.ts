import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EmailService } from "./email.service";
import { SendEmailDto } from "./dto/send-email.dto";

@Controller("email")
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern("send_email_notification")
  async handleSendEmail(@Payload() data: SendEmailDto) {
    this.logger.log(
      `EmailController: Received send_email event with data: ${JSON.stringify(
        data
      )}`
    );
    this.emailService.processEmail(data);
  }
}
