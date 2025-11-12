import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  meta?: Record<string, any>;
}
