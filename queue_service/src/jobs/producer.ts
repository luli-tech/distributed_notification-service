import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ProducerService {
  constructor(@Inject("QUEUE_SERVICE") private readonly client: ClientProxy) {}

  async produceEvent(pattern: string, data: any) {
    this.client.emit(pattern, data);
  }
}
