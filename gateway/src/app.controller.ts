import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Hello message' })
  @ApiResponse({ status: 200, description: 'Returns Hello message.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get health status' })
  @ApiResponse({ status: 200, description: 'Returns health status.' })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
