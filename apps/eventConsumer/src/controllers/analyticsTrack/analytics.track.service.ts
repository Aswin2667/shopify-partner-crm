import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/data-source';
import { DateHelper } from '@org/utils';
@Injectable()
export class AnalyticsTrackService {
  constructor(private readonly prismaService: PrismaService) {}

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
  }
}
