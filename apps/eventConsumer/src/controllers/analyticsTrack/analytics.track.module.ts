import { Module } from '@nestjs/common';
import { AnalyticsTrackController } from './analytics.track.controller';
import { AnalyticsTrackService } from './analytics.track.service';
import { DataSourceModule, PrismaService } from '@org/data-source';
import { CacheManagerModule } from '@org/utils';

@Module({
  imports: [DataSourceModule, CacheManagerModule.register()],
  controllers: [AnalyticsTrackController],
  providers: [AnalyticsTrackService, PrismaService],
})
export class AnalyticsTrackModule {}
