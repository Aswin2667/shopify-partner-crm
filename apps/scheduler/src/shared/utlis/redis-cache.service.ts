import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<string | null> {
    return this.cacheManager.get<string>(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async clearKeys(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
  }
}
