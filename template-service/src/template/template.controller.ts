import { Controller, Get } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  getAllTemplates() {
    return {
      success: true,
      data: this.templateService.getAllTemplates(),
      message: 'Templates fetched successfully',
      meta: null,
    };
  }
}
