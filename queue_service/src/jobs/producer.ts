import { Injectable, Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { retry } from "./retry.util";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);
  constructor(@Inject("QUEUE_SERVICE") private readonly client: ClientProxy) {}

  async produceEvent(pattern: string, data: any) {
    try {
      await retry(() => lastValueFrom(this.client.emit(pattern, data)), 3, 500);
      this.logger.log(`Event emitted: ${pattern} - ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(
        `Failed to emit event after retries: ${pattern}`,
        error
      );
    }
  }
}
