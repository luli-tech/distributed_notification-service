import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Handlebars from 'handlebars';
import Redis from 'ioredis';
import amqplib from 'amqplib';

@Injectable()
export class TemplateService {
  private redis: Redis;
  private rabbitUrl = process.env.RABBITMQ_URL;
  private logger = new Logger(TemplateService.name);

  constructor(private readonly prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  // Create template (idempotent by key)
  async create_template(dto: {
    key: string;
    language?: string;
    body: string;
    meta?: any;
  }) {
    // won't re-create if key exists; you can add idempotency-key header if needed
    const existing = await this.prisma.template.findUnique({
      where: { key: dto.key },
    });
    if (existing) return existing;

    const created = await this.prisma.template.create({ data: dto });
    await this.redis.set(
      `template:${created.key}:${created.language}`,
      created.body,
    );
    await this.publish_event('template.created', {
      template_id: created.id,
      key: created.key,
      language: created.language,
    });
    return created;
  }

  // Update -> new version
  async update_template(
    key: string,
    dto: { language?: string; body: string; meta?: any },
  ) {
    const existing = await this.prisma.template.findUnique({ where: { key } });
    if (!existing) throw new NotFoundException('template_not_found');

    const updated = await this.prisma.template
      .update({
        where: { key },
        data: {
          body: dto.body,
          meta: dto.meta,
          language: dto.language ?? existing.language,
          version: { increment: 1 } as any, // Prisma doesn't allow increment like this; alternative below
        },
      })
      .catch(async () => {
        // safer explicit update: read current version then write
        const newVersion = existing.version + 1;
        return this.prisma.template.update({
          where: { key },
          data: {
            body: dto.body,
            meta: dto.meta,
            language: dto.language ?? existing.language,
            version: newVersion,
            previous_id: existing.id,
          },
        });
      });

    // update cache
    await this.redis.set(`template:${key}:${updated.language}`, updated.body);

    // publish event
    await this.publish_event('template.updated', {
      template_id: updated.id,
      key: updated.key,
      language: updated.language,
      version: updated.version,
    });
    return updated;
  }

  // Render template by key + variables
  async render_template(key: string, variables = {}, language = 'en') {
    const cacheKey = `template:${key}:${language}`;
    let source = await this.redis.get(cacheKey);
    if (!source) {
      const template = await this.prisma.template.findFirst({
        where: { key, language },
      });
      if (!template) throw new NotFoundException('template_not_found');
      source = template.body;
      if (source) await this.redis.set(cacheKey, source);
    }
    const compiled = Handlebars.compile(source);
    return compiled(variables);
  }

  // Small RabbitMQ publisher for template events
  private async publish_event(routingKey: string, payload: any) {
    if (!this.rabbitUrl) return;
    try {
      const conn = await amqplib.connect(this.rabbitUrl);
      const ch = await conn.createChannel();
      const exchange = 'notifications.direct';
      await ch.assertExchange(exchange, 'direct', { durable: true });
      ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), {
        persistent: true,
      });
      await ch.close();
      await conn.close();
    } catch (err) {
      this.logger.warn(
        'Failed to publish template event: ' + (err as Error).message,
      );
    }
  }
}
