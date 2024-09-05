import { Module } from '@nestjs/common';
import { AnalyticsTrackController } from './analytics.track.controller';
import { AnalyticsTrackService } from './analytics.track.service';
import { DataSourceModule,PrismaService } from '@org/data-source';


@Module({
  imports: [DataSourceModule],
  controllers: [AnalyticsTrackController],
  providers: [AnalyticsTrackService,PrismaService],
})
export class AnalyticsTrackModule {}
