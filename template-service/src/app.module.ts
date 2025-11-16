import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TemplateModule } from './template/template.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
    TemplateModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
