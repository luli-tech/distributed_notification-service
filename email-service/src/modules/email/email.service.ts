// email.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { SendEmailDto } from "./dto/send-email.dto";
import sgMail from "@sendgrid/mail"; // ← DEFAULT IMPORT
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("SENDGRID_API_KEY");
    if (!apiKey) {
      this.logger.error("SENDGRID_API_KEY is missing!");
      return;
    }

    sgMail.setApiKey(apiKey); // ← CORRECT
    this.logger.log("SendGrid API key configured");
  }

  async processEmail(sendEmailDto: SendEmailDto) {
    this.logger.log(
      `Processing email for recipient: ${sendEmailDto.recipient}`
    );

    const mail = {
      to: sendEmailDto.recipient,
      from: this.configService.get<string>("SENDGRID_SENDER_EMAIL"),
      subject: sendEmailDto.subject,
      templateId: sendEmailDto.template_name,
      dynamicTemplateData: sendEmailDto.template_variables,
    };

    try {
      await sgMail.send(mail); // ← CORRECT
      this.logger.log(`Email sent to ${sendEmailDto.recipient}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send email to ${sendEmailDto.recipient}`,
        error.response?.body || error.message
      );
      throw error; // Optional: re-throw if you want caller to handle
    }
  }
}
