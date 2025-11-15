import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConsumerModule } from "./jobs/consumer.module";
import { ProducerModule } from "./jobs/producer.module";
import { SchedulerService } from "./jobs/scheduler";
import { HealthController } from "./health.controller";

@Module({
  imports: [ScheduleModule.forRoot(), ConsumerModule, ProducerModule],
  controllers: [HealthController],
  providers: [SchedulerService],
})
export class AppModule {}
