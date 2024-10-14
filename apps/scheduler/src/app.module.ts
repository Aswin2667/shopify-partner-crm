import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LeadActivityModule } from './app-data/LeadActivity.module';
import { LeadActivitySyncService } from './app-data/LeadActivity.Sync.service';
import { EmailCronModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [ ConfigModule.forRoot({
    envFilePath: path.resolve(__dirname, '../../../../', '.env'),
    isGlobal: true,
  }),
  LeadActivityModule, EmailCronModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [LeadActivitySyncService,],
})
export class AppModule {}
