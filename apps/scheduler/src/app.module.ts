// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheManagerModule } from '@org/utils';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { DataSourceModule, PrismaService } from '@org/data-source';
import { LeadActivityModule } from './app-data/LeadActivity.module';
import { AppService } from './app-data/LeadActivity.Sync.cron';
import { LeadActivitySyncService } from './app-data/LeadActivity.Sync.service';

@Module({
  imports: [LeadActivityModule],
  controllers: [],
  providers: [LeadActivitySyncService, PrismaService],
})
export class AppModule {}
