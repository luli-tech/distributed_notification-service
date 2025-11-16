import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';

@ApiTags('Templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all templates with pagination and optional language filter',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'language', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of templates with pagination meta.',
  })
  getTemplates(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('language') language?: string,
  ) {
    return this.templateService.getTemplates(
      Number(page),
      Number(limit),
      language,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Template found.' })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  getTemplateById(@Param('id', ParseIntPipe) id: number) {
    const template = this.templateService.getTemplateById(id);
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({ status: 201, description: 'Template created.' })
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.templateService.createTemplate(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a template (creates new version)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({ status: 200, description: 'Template updated.' })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  updateTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTemplateDto,
  ) {
    const updated = this.templateService.updateTemplate({ ...dto, id });
    if (!updated) throw new NotFoundException('Template not found');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Template deleted.' })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.templateService.deleteTemplate(id);
    if (!deleted) throw new NotFoundException('Template not found');
    return { success: true };
  }

  @Post(':id/render')
  @ApiOperation({ summary: 'Render a template with variables' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    schema: { type: 'object', additionalProperties: { type: 'string' } },
  })
  @ApiResponse({ status: 200, description: 'Rendered template.' })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  renderTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() variables: Record<string, string>,
  ) {
    const rendered = this.templateService.renderTemplate(id, variables);
    if (!rendered) throw new NotFoundException('Template not found');
    return { content: rendered };
  }
}
