import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

@Controller()
export class ConsumerController {
  @EventPattern("user_created")
  async handleUserCreated(data: Record<string, unknown>) {
    console.log("User created event received:", data);
    // Process user creation event, e.g., send welcome email
  }

  @EventPattern("email_send_request")
  async handleEmailSendRequest(data: Record<string, unknown>) {
    console.log("Email send request received:", data);
    // Process email send request, e.g., add to a sending queue
  }
}
