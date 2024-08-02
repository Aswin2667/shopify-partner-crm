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
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<number>('REDIS_PORT');
        const userName = configService.get<string>('REDIS_USERNAME');
        const password = configService.get<string>('REDIS_PASSWORD');

        return new RedisService(host, port, userName, password);
      },
      inject: [ConfigService],
    };
  }
}
