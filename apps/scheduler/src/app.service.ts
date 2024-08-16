import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from './prisma.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APP_INSTALLS_UNINSTALLS_QUERY } from './queries';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  private readonly SHOPIFY_GRAPHQL_URL = 'https://partners.shopify.com/3767841/api/2024-10/graphql.json';
  private readonly ACCESS_TOKEN = 'prtapi_c37b0344cace141df5c89f694f4c15aa';
  private readonly APP_ID = 'gid://partners/App/146380521473';
  private cronEnabled = true; // Flag to control cron job execution

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2, 
    @InjectQueue('app_events') private readonly appEventsQueue: Queue,
  ) {}

  // Cron job that runs every 10 seconds
  @Cron('*/10 * * * * *')
  async handleCron() {
    if (!this.cronEnabled) return; // Check if cron job is enabled

    console.log('Running cron job every 10 seconds...');
    const events = await this.fetchAndStoreData();
    
    // Emit a single event with all details
    if (events) {
      await this.appEventsQueue.add('APP_INSTALLED_UNINSTALLED', events);
    }
  }

  async fetchAndStoreData() {
    // Retrieve the last occurredAt and shopifyDomain values from Redis
    const lastOccurredAt = await this.cacheManager.get<string>('lastOccurredAt');
    const lastShopifyDomain = await this.cacheManager.get<string>('shopifyDomain');

    // Use the query from the external file
    const query = APP_INSTALLS_UNINSTALLS_QUERY(this.APP_ID, lastOccurredAt);

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
      const pageInfo = data?.app?.events?.pageInfo || {};

      if (events.length) {
        let oldestOccurredAt = lastOccurredAt;
        let oldestShopifyDomain = lastShopifyDomain;

        const eventResponses = events.map(edge => edge.node);
        const filteredEvents = [];

        for (const event of eventResponses) {
          const occurredAt = event.occurredAt;
          const shopifyDomain = event.shop.myshopifyDomain;

          if (oldestOccurredAt && oldestShopifyDomain &&
              (new Date(occurredAt) < new Date(oldestOccurredAt) || 
               (occurredAt === oldestOccurredAt && shopifyDomain !== oldestShopifyDomain))) {
            filteredEvents.push(event);
          }

          if (!oldestOccurredAt || new Date(occurredAt) < new Date(oldestOccurredAt)) {
            oldestOccurredAt = occurredAt;
            oldestShopifyDomain = shopifyDomain;
          }
        }

        console.log(`Oldest occurredAt: ${oldestOccurredAt}`);

        // Check if the oldest occurredAt is the same as the lastOccurredAt
        if (lastOccurredAt === oldestOccurredAt) {
          console.log('No new events found since the last check. Stopping cron job.');
          this.cronEnabled = false; // Disable the cron job
        } else {
          // Store the oldest occurredAt of the fetched events in Redis
          await this.cacheManager.set('lastOccurredAt', oldestOccurredAt);
          await this.cacheManager.set('shopifyDomain', oldestShopifyDomain);
        }

        // Log filtered events
        console.log('Filtered Events Length:', filteredEvents.length);
        console.log('Filtered Event Details:', filteredEvents);

        // Return filtered events
        return filteredEvents;
      } else {
        console.log('No new events found');
        // Set lastOccurredAt to 'none' if no new events are found
        await this.cacheManager.set('lastOccurredAt', 'none');
        await this.cacheManager.set('shopifyDomain', 'none');
        this.cronEnabled = false; // Disable the cron job
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch and store data:', error.message);
      throw new Error('Failed to fetch data');
    }
  }
}
