import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { EmailService } from "./email.service";
import { ProcessEmailDto } from "./dto/process-email.dto"; // Use ProcessEmailDto

@ApiTags("Email")
@Controller("email")
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern("send_email_notification")
  @ApiOperation({ summary: "Handle send email notification event" })
  async handleSendEmail(@Payload() data: ProcessEmailDto) {
    this.logger.log(
      `EmailController: Received send_email event with data: ${JSON.stringify(
        data
      )}`
    );
    this.emailService.processEmail(data);
  }
}
