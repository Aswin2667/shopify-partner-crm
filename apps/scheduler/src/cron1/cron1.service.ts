import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { CREDIT_EVENTS_QUERY } from './query1';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CreditEventsService {
  private readonly SHOPIFY_GRAPHQL_URL = 'https://partners.shopify.com/3767841/api/2024-10/graphql.json';
  private readonly ACCESS_TOKEN = 'prtapi_c37b0344cace141df5c89f694f4c15aa';
  private readonly APP_ID = 'gid://partners/App/146380521473';
  private cronEnabled = true; // Flag to control cron job execution

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('credit_events') private readonly creditEventsQueue: Queue,
  ) {}

  // Cron job that runs every 10 seconds
  @Cron('*/10 * * * * *')
  async handleCron() {
    if (!this.cronEnabled) return; // Check if cron job is enabled

    console.log('Running cron job every 10 seconds from cron1...');
    const events = await this.fetchAndStoreCreditEvents();
    
    // Emit a single event with all details
    if (events) {
      await this.creditEventsQueue.add('CREDIT_EVENTS', events);
    }
  }

  async fetchAndStoreCreditEvents() {
    // Retrieve the last occurredAt and shopifyDomain values from Redis
    const lastOccurredAt = await this.cacheManager.get<string>('lastCreditEventOccurredAt');
    const lastShopifyDomain = await this.cacheManager.get<string>('lastCreditEventShopifyDomain');

    // Use the query from the external file
    const query = CREDIT_EVENTS_QUERY(this.APP_ID, lastOccurredAt);

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

        console.log(`Oldest occurredAt from cron1: ${oldestOccurredAt}`);

        // Check if the oldest occurredAt is the same as the lastOccurredAt
        if (lastOccurredAt === oldestOccurredAt) {
          console.log('No new credit events found since the last check. Stopping cron job from cron1.');
          this.cronEnabled = false; // Disable the cron job
        } else {
          // Store the oldest occurredAt of the fetched events in Redis
          await this.cacheManager.set('lastCreditEventOccurredAt', oldestOccurredAt);
          await this.cacheManager.set('lastCreditEventShopifyDomain', oldestShopifyDomain);
        }

        // Log filtered events
        console.log('Filtered Credit Events from cron1:', filteredEvents);

        // Return filtered events
        return filteredEvents;
      } else {
        console.log('No new credit events found from cron1');
        // Set lastOccurredAt to 'none' if no new events are found
        await this.cacheManager.set('lastCreditEventOccurredAt', 'none');
        await this.cacheManager.set('lastCreditEventShopifyDomain', 'none');
        this.cronEnabled = false; // Disable the cron job
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch and store credit events from cron1:', error.message);
      throw new Error('Failed to fetch credit events from cron1');
    }
  }
}
