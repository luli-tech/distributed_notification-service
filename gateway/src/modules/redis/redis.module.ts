import { Module, Global, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        if (!redisUrl) {
          throw new Error('REDIS_URL is missing in environment');
        }

        // RAILWAY FIX 1: Force redis:// (not rediss://)
        let url = redisUrl.trim();
        if (url.startsWith('rediss://')) {
          Logger.warn(
            'Forcing redis:// instead of rediss:// for Railway Redis',
            'RedisModule',
          );
          url = url.replace(/^rediss:\/\//i, 'redis://');
        }

        // RAILWAY FIX 2: Add ?family=0 for IPv6 (private networking)
        const separator = url.includes('?') ? '&' : '?';
        const finalUrl = `${url}${separator}family=0`;

        Logger.log(
          `Connecting to Redis: ${finalUrl.replace(/redis:\/\/[^@]+@/, 'redis://***@')}`,
          'RedisModule',
        );

        const redis = new Redis(finalUrl, {
          retryStrategy: (times) => {
            const delay = Math.min(times * 500, 2000);
            if (times >= 10) {
              Logger.error(
                'Redis: Max retries exceeded. Giving up.',
                '',
                'RedisModule',
              );
              return null;
            }
            Logger.warn(
              `Redis: Retrying in ${delay}ms... (attempt ${times})`,
              'RedisModule',
            );
            return delay;
          },
          reconnectOnError: () => true,
          maxRetriesPerRequest: 5,
          lazyConnect: true,
        });

        redis.on('connect', () =>
          Logger.log('Redis connected successfully', 'RedisModule'),
        );
        redis.on('ready', () =>
          Logger.log('Redis ready for commands', 'RedisModule'),
        );
        redis.on('error', (err) => {
          if (
            err.message.includes('ETIMEDOUT') ||
            err.message.includes('ECONNREFUSED')
          ) {
            Logger.warn(
              `Redis connection failed: ${err.message}`,
              'RedisModule',
            );
          } else {
            Logger.error(
              `Redis error: ${err.message}`,
              err.stack,
              'RedisModule',
            );
          }
        });

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
