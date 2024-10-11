import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      url: "redis://default:VSqteQE9zbSBBZcpJydJ8TodySmtIlGs@redis-10294.c261.us-east-1-4.ec2.redns.redis-cloud.com:10294",
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