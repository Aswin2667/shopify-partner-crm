import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from './prisma.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AppService1 {
  private readonly SHOPIFY_GRAPHQL_URL = 'https://partners.shopify.com/3767841/api/2024-10/graphql.json';
  private readonly ACCESS_TOKEN = 'prtapi_c37b0344cace141df5c89f694f4c15aa';
  private readonly APP_ID = 'gid://partners/App/146380521473';

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.fetchAndStoreData();
  }

  private async fetchAndStoreData() {
    // Retrieve the last occurredAt value from Redis
    const lastOccurredAt = await this.cacheManager.get<string>('lastOccurredAt');

    const query = `
      query appInstallsAndUninstalls {
        app(id: "${this.APP_ID}") {
          id
          events(
            first: 1
            types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED]
            occurredAtMax: "${ lastOccurredAt }"
          ) {
            edges {
              node {
                ...installs
              }
              cursor
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }

      fragment installs on AppEvent {
        ... on RelationshipInstalled {
          shop {
            id
            myshopifyDomain
            avatarUrl
            name
            __typename
          }
          occurredAt
          type
        }
        ... on RelationshipUninstalled {
          type
          shop {
            id
            myshopifyDomain
            avatarUrl
            name
            __typename
          }
          reason
        }
      }
    `;

    try {
      const response = await axios.post(
        this.SHOPIFY_GRAPHQL_URL,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.ACCESS_TOKEN,
          },
        },
      );

      const data = response.data.data;
      const events = data?.app?.events?.edges || [];

      if (events.length) {
        const event = events[0].node;
        const occurredAt = event.occurredAt;

        // Store the occurredAt of the last fetched event in Redis
        await this.cacheManager.set('lastOccurredAt', occurredAt);

        // Log or process the fetched event
        console.log('Fetched event:', event);
      } else {
        console.log('No new events found');
      }
    } catch (error) {
      console.error('Failed to fetch and store data:', error.message);
    }
  }
}
