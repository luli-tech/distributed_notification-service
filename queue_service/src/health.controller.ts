import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Check health status of the Queue Service" })
  @ApiResponse({
    status: 200,
    description: "Returns health status and current timestamp.",
  })
  check() {
    return { status: "ok", timestamp: new Date() };
  }
}
