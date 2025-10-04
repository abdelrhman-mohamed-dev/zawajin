import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export const getRedisConfig = async (
  configService: ConfigService,
): Promise<CacheModuleOptions> => {
  const store = await redisStore({
    socket: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    },
    password: configService.get<string>('REDIS_PASSWORD'),
    database: configService.get<number>('REDIS_DB', 0),
  });

  return {
    store: store as any,
    ttl: configService.get<number>('REDIS_TTL', 300),
  };
};