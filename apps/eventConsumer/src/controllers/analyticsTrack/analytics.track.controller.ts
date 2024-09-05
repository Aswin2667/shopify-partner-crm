import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AnalyticsTrackService } from './analytics.track.service';

@Controller('analytics')
export class AnalyticsTrackController {
  constructor(private readonly analyticsTrackService: AnalyticsTrackService) {}

  @Post('track')
  trackEvent(
    @Body('event') event: string,
    @Body('properties') properties: any,
    @Headers('Authorization') authHeader: string,
  ) {
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization token not found or invalid',
      );
    }
    const token = authHeader.split(' ')[1];

    return this.analyticsTrackService.trackEvent(event, properties, token);
  }

  @Post('identify')
  identifyUser(
    @Body('traits') traits: any,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = authHeader.split(' ')[1];
    const lead = this.analyticsTrackService.identifyUser(traits, token);
    return {
      status: 'true',
      message: 'Lead details saved successfully',
      data: lead,
    };
  }

  @Post('page-visit')
  logPageVisit(@Body('pageName') pageName: string) {
    this.analyticsTrackService.logPageVisit(pageName);
    return { status: 'Page visit logged successfully' };
  }
}
