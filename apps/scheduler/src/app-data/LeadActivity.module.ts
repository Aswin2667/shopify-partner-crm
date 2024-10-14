// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheManagerModule } from '@org/utils';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
// import { DataSourceModule, PrismaService } from '@org/data-source';
import { LeadActivitySyncService } from './LeadActivity.Sync.service';
import { AppService } from './LeadActivity.Sync.cron';

@Module({
  imports: [
    CacheManagerModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'redis-10294.c261.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10294,
        password: 'VSqteQE9zbSBBZcpJydJ8TodySmtIlGs',
        username: 'default',
      },
    }),
    BullModule.registerQueue({
      name: 'app_events_queue',
      redis: {
        host: 'redis-10294.c261.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10294,
        username:"default",
        password: "VSqteQE9zbSBBZcpJydJ8TodySmtIlGs",
      }
    }),
  ],
  controllers: [],
  providers: [LeadActivitySyncService, AppService],
})
export class LeadActivityModule {}
