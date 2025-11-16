import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {
  TemplateDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  PaginationMeta,
} from './dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private templates: TemplateDto[] = [
    {
      id: 1,
      name: 'Welcome Email',
      language: 'en',
      content: 'Hello, {{name}}! Welcome to our service.',
      version: 1,
      variables: ['name'],
    },
    {
      id: 2,
      name: 'Bienvenido',
      language: 'es',
      content: 'Hola, {{name}}! Bienvenido a nuestro servicio.',
      version: 1,
      variables: ['name'],
    },
  ];
  private nextId = 3;

  getTemplates(
    page = 1,
    limit = 10,
    language?: string,
  ): { data: TemplateDto[]; meta: PaginationMeta } {
    let filtered = this.templates;
    if (language) {
      filtered = filtered.filter((t) => t.language === language);
    }
    const total = filtered.length;
    const total_pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);
    const meta: PaginationMeta = {
      total,
      limit,
      page,
      total_pages,
      has_next: page < total_pages,
      has_previous: page > 1,
    };
    this.logger.log(
      `Fetched templates: page ${page}, limit ${limit}, language ${language || 'any'}`,
    );
    return { data, meta };
  }

  getTemplateById(id: number): TemplateDto | undefined {
    const template = this.templates.find((t) => t.id === id);
    this.logger.log(`Fetched template by id: ${id}`);
    return template;
  }

  createTemplate(dto: CreateTemplateDto): TemplateDto {
    const newTemplate: TemplateDto = {
      id: this.nextId++,
      name: dto.name,
      language: dto.language,
      content: dto.content,
      version: 1,
      variables: dto.variables || [],
    };
    this.templates.push(newTemplate);
    this.logger.log(`Created template: ${JSON.stringify(newTemplate)}`);
    return newTemplate;
  }

  updateTemplate(dto: UpdateTemplateDto): TemplateDto | undefined {
    const idx = this.templates.findIndex((t) => t.id === dto.id);
    if (idx === -1) return undefined;
    const old = this.templates[idx];
    const updated: TemplateDto = {
      ...old,
      ...dto,
      version: old.version + 1,
    };
    this.templates[idx] = updated;
    this.logger.log(`Updated template: ${JSON.stringify(updated)}`);
    return updated;
  }

  deleteTemplate(id: number): boolean {
    const idx = this.templates.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.templates.splice(idx, 1);
    this.logger.log(`Deleted template id: ${id}`);
    return true;
  }

  renderTemplate(
    id: number,
    variables: Record<string, string>,
  ): string | undefined {
    const template = this.getTemplateById(id);
    if (!template) return undefined;
    let content = template.content;
    for (const key of template.variables) {
      const value = variables[key] || '';
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    this.logger.log(
      `Rendered template id: ${id} with variables: ${JSON.stringify(variables)}`,
    );
    return content;
  }
}
