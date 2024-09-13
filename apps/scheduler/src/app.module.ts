import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DataSourceModule, PrismaService } from '@org/data-source';
import { LeadActivityModule } from './app-data/LeadActivity.module';
import { LeadActivitySyncService } from './app-data/LeadActivity.Sync.service';
import { EmailCronModule } from './email/email.module';

@Module({
  imports: [LeadActivityModule, EmailCronModule, ScheduleModule.forRoot(), DataSourceModule],
  controllers: [],
  providers: [LeadActivitySyncService, PrismaService],
})
export class AppModule {}
