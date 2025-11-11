import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  processEmail(sendEmailDto: SendEmailDto) {
    this.logger.log(`Processing email for recipient: ${sendEmailDto.recipient}`);
    // In a real scenario, this is where the actual email sending logic would go.
    // For now, we just log to confirm the method is called.
    this.logger.log(`Email subject: ${sendEmailDto.subject}`);
    this.logger.log(`Email body: ${sendEmailDto.body}`);
  }
}