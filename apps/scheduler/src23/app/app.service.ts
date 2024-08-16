import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src23/prisma/prisma.service';
import { ACCESS_TOKEN, getShopifyEventsQuery, SHOPIFY_GRAPHQL_URL } from 'src23/graphql/shopify-queries';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchAndStoreData() {
    const lastOccurredAt = await this.cacheManager.get<string>('lastOccurredAt');

    const query = getShopifyEventsQuery(lastOccurredAt);

    try {
      const response = await axios.post(
        SHOPIFY_GRAPHQL_URL,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': ACCESS_TOKEN,
          },
        },
      );

      const data = response.data.data;
      const events = data?.app?.events?.edges || [];
      const pageInfo = data?.app?.events?.pageInfo || {};

      if (events.length) {
        // Find the oldest occurredAt from the events
        let oldestOccurredAt = lastOccurredAt;
        
        for (const edge of events) {
          const occurredAt = edge.node.occurredAt;
          if (!oldestOccurredAt || new Date(occurredAt) < new Date(oldestOccurredAt)) {
            oldestOccurredAt = occurredAt;
          }
        }

        console.log(`Oldest occurredAt: ${oldestOccurredAt}`);

        // Store the oldest occurredAt of the fetched events in Redis
        await this.cacheManager.set('lastOccurredAt', oldestOccurredAt);

        // Process the events as needed (e.g., save to the database)
        for (const event of events) {
          // Implement the logic to store event in the database using Prisma
          console.log(event.node);
        }
      } else {
        console.log('No new events found');
      }
    } catch (error) {
      console.error('Failed to fetch and store data:', error.message);
      throw new Error('Failed to fetch data');
    }
  }
}
