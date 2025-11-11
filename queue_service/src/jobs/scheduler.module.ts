import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerService } from "./scheduler";
import { ProducerModule } from "./producer.module";

@Module({
  imports: [ScheduleModule.forRoot(), ProducerModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
