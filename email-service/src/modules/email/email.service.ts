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
      throw new Error("SENDGRID_API_KEY is not configured.");
    }

    sgMail.setApiKey(apiKey);
    this.logger.log("SendGrid API key configured");

    const senderEmail = this.configService.get<string>("SENDGRID_SENDER_EMAIL");
    if (!senderEmail) {
      this.logger.error("SENDGRID_SENDER_EMAIL is missing!");
      throw new Error("SENDGRID_SENDER_EMAIL is not configured.");
    }
  }

  async processEmail(sendEmailDto: SendEmailDto) {
    this.logger.log(
      `Processing email for recipient: ${sendEmailDto.recipient}`
    );

    const senderEmail = this.configService.get<string>("SENDGRID_SENDER_EMAIL");
    const mail = {
      to: sendEmailDto.recipient,
      from: senderEmail,
      subject: sendEmailDto.subject,
      templateId: sendEmailDto.template_name,
      dynamicTemplateData: sendEmailDto.template_variables,
    };

    try {
      await sgMail.send(mail);
      this.logger.log(`Email sent to ${sendEmailDto.recipient}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send email to ${sendEmailDto.recipient}`,
        error.response?.body || error.message
      );
      throw error;
    }
  }

  // Placeholder for handling delivery confirmations and bounces
  async handleDeliveryConfirmation(event: any) {
    this.logger.log(`Delivery confirmation received: ${JSON.stringify(event)}`);
    // Implement logic to update notification status in a database or Redis
  }

  async handleBounce(event: any) {
    this.logger.warn(`Bounce event received: ${JSON.stringify(event)}`);
    // Implement logic to update notification status, potentially disable user's email, etc.
  }
}
