// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheManagerModule } from '@org/utils';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { DataSourceModule, PrismaService } from '@org/data-source';
import { LeadActivitySyncService } from './LeadActivity.Sync.service';
import { AppService } from './LeadActivity.Sync.cron';

@Module({
  imports: [
    CacheManagerModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6378,
      },
    }),
    BullModule.registerQueue({
      name: 'app_events_queue',
    }),
    DataSourceModule,
  ],
  controllers: [],
  providers: [LeadActivitySyncService, PrismaService,AppService],
})
export class LeadActivityModule {}