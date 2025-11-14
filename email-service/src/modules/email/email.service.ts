import { Injectable, Logger } from "@nestjs/common";
import { SendEmailDto } from "./dto/send-email.dto";
import * as SendGrid from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(
      this.configService.get<string>("SENDGRID_API_KEY") ?? ""
    );
  }

  async processEmail(sendEmailDto: SendEmailDto) {
    this.logger.log(
      `EmailService: Processing email for recipient: ${sendEmailDto.recipient}`
    );

    const mail = {
      to: sendEmailDto.recipient,
      from: sendEmailDto.from,
      subject: sendEmailDto.subject,
      html: sendEmailDto.body,
    };

    try {
      await SendGrid.send(mail);
      this.logger.log(`Email sent to ${sendEmailDto.recipient}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${sendEmailDto.recipient}`,
        error
      );
    }
  }
}
