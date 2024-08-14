import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import * as redisStore from 'cache-manager-redis-store'


@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: '172.24.0.4',
            port: 6379,
        })
    ],
})

export class RedisModule {}