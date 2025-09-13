import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  // eslint-disable-next-line no-unused-vars
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: any, ttl: number | null): Promise<void> {
    const ttlValue = ttl ? ttl : Number(process.env.REDIS_TTL || 3600);
    await this.cacheManager.set(key, value, ttlValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
