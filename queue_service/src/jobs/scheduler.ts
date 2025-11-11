import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProducerService } from "./producer";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger("SchedulerService");

  constructor(private readonly producerService: ProducerService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.debug("Called every 10 seconds");
    this.producerService.produceEvent("scheduled_task", {
      timestamp: new Date(),
    });
  }
}
