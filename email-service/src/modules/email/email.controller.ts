import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern('send_email')
  async handleSendEmail(@Payload() data: SendEmailDto) {
    this.logger.log(`Received send_email event: ${JSON.stringify(data)}`);
    // In a real scenario, you would call emailService.sendEmail(data) here
    // For now, we just log to confirm receipt
    this.emailService.processEmail(data);
  }
}