import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerStorageService } from "@nestjs/throttler";
import { ClientsModule } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getRabbitMqConfig } from "./config/rabbitmq.config";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config"; // Import ConfigModule

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
      storage:
        new (require("@nestjs/throttler/dist/throttler-storage-memory.service").ThrottlerStorageMemoryService)(),
    }),
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        ...getRabbitMqConfig("user_queue"),
      },
    ]),
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      // Add ConfigModule for environment variables
      isGlobal: true,
      envFilePath: "./infra/env/user-service.env", // Specify the correct path to the .env file
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
