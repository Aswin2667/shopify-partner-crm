import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { DateHelper } from './helpers/date.helper';
import { CacheManagerModule } from './cache-manager/cache-manager.module';

@Module({
  imports: [RedisModule, MailModule, CacheManagerModule],
  providers: [DateHelper],
})
export class UtilsModule {}
