import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  total_pages: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if there is a next page',
  })
  has_next: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if there is a previous page',
  })
  has_previous: boolean;
}

export class TemplateDto {
  @ApiProperty({ example: 1, description: 'Unique ID of the template' })
  id: number;

  @ApiProperty({
    example: 'welcome_email',
    description: 'Name of the template',
  })
  name: string;

  @ApiProperty({ example: 'en', description: 'Language of the template' })
  language: string;

  @ApiProperty({
    example: '<h1>Welcome, {{name}}!</h1>',
    description: 'Content of the template',
  })
  content: string;

  @ApiProperty({ example: 1, description: 'Version of the template' })
  version: number;

  @ApiProperty({
    example: ['name'],
    description: 'List of variables used in the template',
  })
  variables: string[];
}

export class CreateTemplateDto {
  @ApiProperty({
    example: 'new_user_email',
    description: 'Name of the template',
  })
  name: string;

  @ApiProperty({ example: 'en', description: 'Language of the template' })
  language: string;

  @ApiProperty({
    example: '<p>Hello {{username}}</p>',
    description: 'Content of the template',
  })
  content: string;

  @ApiProperty({
    example: ['username'],
    description: 'Variables used in the template',
    required: false,
  })
  variables?: string[];
}

export class UpdateTemplateDto {
  @ApiProperty({ example: 1, description: 'Unique ID of the template' })
  id: number;

  @ApiProperty({
    example: 'updated_welcome_email',
    description: 'Name of the template',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'fr',
    description: 'Language of the template',
    required: false,
  })
  language?: string;

  @ApiProperty({
    example: '<h1>Bienvenue, {{name}}!</h1>',
    description: 'Content of the template',
    required: false,
  })
  content?: string;

  @ApiProperty({
    example: ['name', 'date'],
    description: 'Variables used in the template',
    required: false,
  })
  variables?: string[];
}
