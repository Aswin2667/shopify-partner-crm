import { Controller, Post, Body,Headers, UnauthorizedException } from '@nestjs/common';
import { AnalyticsTrackService } from './analytics.track.service';

@Controller('analytics')
export class AnalyticsTrackController {
  constructor(private readonly analyticsTrackService: AnalyticsTrackService) {}

  @Post('track')
  trackEvent(
    @Body('event') event: string,
    @Body('properties') properties: any,
    @Headers('Authorization') authHeader: string
  ) {
    // Verify the Authorization token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token not found or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!this.validateToken(token)) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    // Proceed with event tracking
    this.analyticsTrackService.trackEvent(event, properties);
    return {token, status: 'Event tracked successfully' };
  }

  validateToken(token: string): boolean {
    console.log(token)
    return true; 
  }

  
  @Post('identify')
  identifyUser(@Body('userId') userId: string, @Body('traits') traits: any) {
    this.analyticsTrackService.identifyUser(userId, traits);
    return { status: 'User identified successfully' };
  }

  @Post('page-visit')
  logPageVisit(@Body('pageName') pageName: string) {
    this.analyticsTrackService.logPageVisit(pageName);
    return { status: 'Page visit logged successfully' };
  }
}
