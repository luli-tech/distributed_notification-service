import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { ClientsModule } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getRabbitMqConfig } from "./config/rabbitmq.config";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./infra/env/user-service.env",
    }),

    // Throttler (rate-limiting) with Redis
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: 60,
        limit: 20,
        storageOptions: {
          host: config.get("REDIS_HOST"),
          port: +config.get("REDIS_PORT"),
          password: config.get("REDIS_PASSWORD") || undefined,
        },
      }),
    }),

    ClientsModule.register([
      {
        name: "USER_SERVICE",
        ...getRabbitMqConfig("user_queue"),
      },
    ]),

    UserModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
