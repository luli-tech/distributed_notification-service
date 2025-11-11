import { Module } from "@nestjs/common";
import { ConsumerController } from "./consumer";

@Module({
  controllers: [ConsumerController],
  providers: [],
})
export class ConsumerModule {}
