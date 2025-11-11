import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  getAllTemplates() {
    return [{ id: 1, name: 'Welcome Template', language: 'en' }];
  }
}
