// src/services/credit-events.service.ts

import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CREDIT_EVENTS_QUERY } from './query1';

@Injectable()
export class Cron1Service {
  private readonly SHOPIFY_GRAPHQL_URL = 'https://partners.shopify.com/3767841/api/2024-10/graphql.json';
  private readonly ACCESS_TOKEN = 'prtapi_c37b0344cace141df5c89f694f4c15aa';
  private readonly APP_ID = 'gid://partners/App/146380521473';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async fetchAndEmitCreditEvents() {
    const lastOccurredAt = await this.cacheManager.get<string>('lastCreditEventOccurredAt');
    const lastShopifyDomain = await this.cacheManager.get<string>('lastCreditEventShopifyDomain');

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

        if (filteredEvents.length) {
          console.log('Filtered Credit Events:', filteredEvents);
          this.eventEmitter.emit('creditEvents.all', filteredEvents);
          await this.cacheManager.set('lastCreditEventOccurredAt', oldestOccurredAt);
          await this.cacheManager.set('lastCreditEventShopifyDomain', oldestShopifyDomain);
        }
      } else {
        console.log('No new credit events found');
        await this.cacheManager.set('lastCreditEventOccurredAt', 'none');
        await this.cacheManager.set('lastCreditEventShopifyDomain', 'none');
      }
    } catch (error) {
      console.error('Failed to fetch and store credit events:', error.message);
      throw new Error('Failed to fetch credit events');
    }
  }
}
