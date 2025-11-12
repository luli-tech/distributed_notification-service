import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProducerService } from "./producer";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger("SchedulerService");

  constructor(private readonly producerService: ProducerService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug("Called every 10 seconds");
    try {
      await this.producerService.produceEvent("scheduled_task", {
        timestamp: new Date(),
      });
      this.logger.log("Scheduled task event emitted");
    } catch (error) {
      this.logger.error("Failed to emit scheduled task event", error);
    }
  }
}
