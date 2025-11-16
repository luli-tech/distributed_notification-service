import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";
import { ConfigService } from "@nestjs/config";
import { SendPushDto } from "./dto/send-push.dto";

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const firebaseConfig = {
      projectId: this.configService.get<string>("FIREBASE_PROJECT_ID"),
      privateKey: (
        this.configService.get<string>("FIREBASE_PRIVATE_KEY") ?? ""
      ).replace(/\\n/g, "\n"),
      clientEmail: this.configService.get<string>("FIREBASE_CLIENT_EMAIL"),
    };

    if (
      !firebaseConfig.projectId ||
      !firebaseConfig.privateKey ||
      !firebaseConfig.clientEmail
    ) {
      this.logger.error("Firebase credentials are not fully configured!");
      throw new Error("Firebase credentials missing.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
    this.logger.log("Firebase Admin SDK initialized");
  }

  async sendPushNotification(sendPushDto: SendPushDto): Promise<boolean> {
    this.logger.log(
      `Attempting to send push notification to device: ${sendPushDto.device_token}`
    );

    const message: admin.messaging.Message = {
      token: sendPushDto.device_token,
      notification: {
        title: sendPushDto.title,
        body: sendPushDto.body,
      },
      data: {
        notification_id: sendPushDto.request_id,
        ...(sendPushDto.image && { image: sendPushDto.image }),
        ...(sendPushDto.link && { link: sendPushDto.link }),
        ...(sendPushDto.data && {
          custom_data: JSON.stringify(sendPushDto.data),
        }),
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
      android: {
        priority: "high",
      },
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(
        `Successfully sent message to device ${sendPushDto.device_token}: ${response}`
      );
      return true;
    } catch (error: any) {
      this.logger.error(
        `Failed to send push notification to ${sendPushDto.device_token}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
