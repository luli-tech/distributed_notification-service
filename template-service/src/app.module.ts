import { Module } from '@nestjs/common';
import { TemplateModule } from './template/template.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TemplateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
