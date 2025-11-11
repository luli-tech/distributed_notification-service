import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConsumerModule } from "./jobs/consumer.module";
import { ProducerModule } from "./jobs/producer.module";
import { SchedulerService } from "./jobs/scheduler";

@Module({
  imports: [ScheduleModule.forRoot(), ConsumerModule, ProducerModule],
  controllers: [],
  providers: [SchedulerService],
})
export class AppModule {}
