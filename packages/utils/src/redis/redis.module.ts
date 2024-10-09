import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static register(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [this.createProvider()],
      exports: [this.createProvider()],
      global: true,
    };
  }

  private static createProvider(): Provider {
    return {
      provide: 'RedisQueue',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST')||'redis-10294.c261.us-east-1-4.ec2.redns.redis-cloud.com';
        const port = configService.get<number>('REDIS_PORT') || 10294;
        const userName = configService.get<string>('REDIS_USERNAME');
        const password = configService.get<string>('REDIS_PASSWORD')||"p1830346036ef825416d8a2762af8d34dda80f543a35570c0b734a538143b9283";
        return new RedisService(host, port, userName, password);
      },
      inject: [ConfigService],
    };
  }
}
