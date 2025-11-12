import { Controller, Post, Body, Put, Param, Get, Query } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { RenderTemplateQuery } from './dto/render-template.dto';

@Controller('templates')
export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  @Post()
  async create(@Body() body: CreateTemplateDto) {
    // Optional: idempotency using header
    const data = await this.service.create_template(body);
    return {
      success: true,
      data,
      message: 'template_created',
      meta: {
        total: 1,
        limit: 1,
        page: 1,
        total_pages: 1,
        has_next: false,
        has_previous: false,
      },
    };
  }

  @Put(':key')
  async update(@Param('key') key: string, @Body() body: CreateTemplateDto) {
    const data = await this.service.update_template(key, body);
    return { success: true, data, message: 'template_updated', meta: {} };
  }

  @Get(':key/render')
  async render(@Param('key') key: string, @Query() q: RenderTemplateQuery) {
    const vars = q.variables ? JSON.parse(q.variables) : {};
    const rendered = await this.service.render_template(
      key,
      vars,
      q.language || 'en',
    );
    return {
      success: true,
      data: { rendered },
      message: 'render_success',
      meta: {},
    };
  }

  @Get('/health')
  health() {
    return {
      success: true,
      data: { db: 'ok', redis: 'ok' },
      message: 'healthy',
      meta: {},
    };
  }
}
