export class PaginationMeta {
  total: number;
  limit: number;
  page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export class TemplateDto {
  id: number;
  name: string;
  language: string;
  content: string;
  version: number;
  variables: string[];
}

export class CreateTemplateDto {
  name: string;
  language: string;
  content: string;
  variables?: string[];
}

export class UpdateTemplateDto {
  id: number;
  name?: string;
  language?: string;
  content?: string;
  variables?: string[];
}
