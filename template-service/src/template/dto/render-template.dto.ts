import { IsOptional, IsString } from 'class-validator';

export class RenderTemplateQuery {
  @IsOptional()
  @IsString()
  language?: string;

  // variables will be passed as JSON string in query for simple curl testing
  @IsOptional()
  @IsString()
  variables?: string;
}
