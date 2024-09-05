import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@org/data-source';
import { DateHelper } from '@org/utils';
// import { EventPublisherService } from 'src/publisher/analytics.event';
// import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AnalyticsTrackService {
  constructor(
    private readonly prismaService: PrismaService,
    // private readonly eventPublisherService: EventPublisherService,
    // @Inject(CACHE_MANAGER) private redisClient: Cache,
  ) {}
  trackEvent(event: string, properties: any, token: string): void {
    console.log('Tracking event:', event, properties);
  }
  async identifyUser(body: any, token: string): Promise<any> {
    console.log(body);
    try {
      const project = await this.prismaService.project.findFirst({
        where: {
          cliAccessToken: token,
        },
      });

      if (!project) {
        throw new Error('Project with the given CLI access token not found');
      }

      const lead = await this.prismaService.lead.upsert({
        where: {
          shopifyDomain: body.myshopifyDomain,
        },
        update: {
          shopDetails: {
            ...body,
          },
          updatedAt: DateHelper.getCurrentUnixTime(),
        },
        create: {
          shopifyDomain: body.myshopifyDomain,
          shopifyStoreId: body.id,
          shopDetails: {
            ...body,
          },
          organizationId: project.organizationId,
          integrationId: project.integrationId,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: 0,
          deletedAt: 0,
        },
      });

      console.log('Lead upserted:', lead);

      // Cache shop details in Redis
      // await this.redisClient.set(body.myShopifyDomain, JSON.stringify(body));

      // Emit an event after user identification
      // this.eventPublisherService.emitEvent('user.identified', {
      //   shopDomain: body.myshopifyDomain,
      //   shopData: body,
      // });

      return lead;
    } catch (error) {
      console.error('Error identifying user:', error.message);
    }
  }

  logPageVisit(pageName: string): void {
    const properties = {
      page: pageName || 'default-page',
      timestamp: new Date().toISOString(),
    };
    console.log('Page visit logged:', properties);

    // Emit page visit event
    // this.eventPublisherService.emitEvent('page.visit', properties);
  }
}
