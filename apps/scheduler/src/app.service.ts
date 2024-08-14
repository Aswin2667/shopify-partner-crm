import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from './prisma.service';
 import { CACHE_MANAGER,Cache } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
  private readonly SHOPIFY_GRAPHQL_URL = 'https://partners.shopify.com/3767841/api/2024-10/graphql.json';
  private readonly ACCESS_TOKEN = 'prtapi_c37b0344cace141df5c89f694f4c15aa';
  private readonly APP_ID = 'gid://partners/App/146380521473';

  constructor(private readonly prismaService: PrismaService ,@Inject(CACHE_MANAGER) private cacheManager:Cache) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.fetchAndStoreData();
  }

  private async fetchAndStoreData() {
    this.cacheManager.set("cursor", "cursor1")
    const cursorValue =  await this.cacheManager.get("cursor")

    console.log(cursorValue)

    const query = `
      query appInstallsAndUninstalls($cursor: String) {
        app(id: "${this.APP_ID}") {
          id
          events(
            first: 4
            types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED]
            after: $cursor
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
      let hasNextPage = true;
      let cursor: string | null = null;

      while (hasNextPage) {
        const response = await axios.post(
          this.SHOPIFY_GRAPHQL_URL,
          {
            query,
            // variables: { cursor },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': this.ACCESS_TOKEN,
            },
          },
        );

        const data = response.data.data;
        const events = data?.app?.events?.edges || [];
        const pageInfo = data?.app?.events?.pageInfo || {};

        // Log the response in the specified format
        console.log(JSON.stringify({
          data: {
            app: {
              id: this.APP_ID,
              events: {
                edges: events.map(edge => ({
                  node: edge.node,
                  cursor: edge.cursor,
                })),
                pageInfo: {
                  hasNextPage: pageInfo.hasNextPage,
                },
              },
            },
          },
        }, null, 2));

        for (const edge of events) {
          const store = edge.node.shop;
          // Process or store event logic here

          // console.log(store);
        }

        hasNextPage = pageInfo.hasNextPage;
        cursor = events.length ? events[events.length - 1].cursor : null;
      }
    } catch (error) {
      console.error('Failed to fetch and store data:', error.message);
    }


  }
}
