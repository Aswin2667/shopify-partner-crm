import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      url: "redis://redis:6379",
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

@Global()
export class CacheManagerModule {
  static register(): DynamicModule {
    return {
      module: CacheManagerModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync(RedisOptions),
      ],
      global: true,
    };
  }
}
