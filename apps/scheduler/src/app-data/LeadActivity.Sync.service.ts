import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import axios from 'axios';
import {
  APP_INSTALLS_UNINSTALLS_AFTER_QUERY,
  APP_INSTALLS_UNINSTALLS_QUERY,
} from 'src/queries/queries';
import prisma from 'src/utils/PrismaService';
@Injectable()
export class LeadActivitySyncService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
   ) {}

  async fetchAndStoreData(app) {
    const { appId, partnerId, accessToken } = app;

    const lastOccurredAtKey = `${appId}:lastOccurredAt`;
    const lastShopifyDomainKey = `${appId}:shopifyDomain`;
    const backupOccurredAtKey = `${appId}:backup:lastOccurredAt`;
    const backupShopifyDomainKey = `${appId}:backup:shopifyDomain`;

    const lastOccurredAt =
      await this.cacheManager.get<string>(lastOccurredAtKey);
    const lastShopifyDomain =
      await this.cacheManager.get<string>(lastShopifyDomainKey);

    const query = APP_INSTALLS_UNINSTALLS_QUERY(appId, lastOccurredAt);

    try {
      const response = await axios.post(
        `https://partners.shopify.com/${partnerId}/api/2024-10/graphql.json`,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
        },
      );

      const data = response.data.data;
      const events = data?.app?.events?.edges || [];

      console.log('Received events data:', data);

      if (events.length) {
        let oldestOccurredAt = lastOccurredAt;
        let oldestShopifyDomain = lastShopifyDomain;

        const eventResponses = events.map((edge) => edge.node);

        const uniqueEvents = new Set();

        const filteredEvents = eventResponses.filter((event) => {
          const occurredAt = event.occurredAt;
          const shopifyDomain = event.shop.myshopifyDomain;

          const eventIdentifier = `${occurredAt}-${shopifyDomain}`;

          if (uniqueEvents.has(eventIdentifier)) {
            return false;
          }

          uniqueEvents.add(eventIdentifier);

          return (
            !lastOccurredAt ||
            new Date(occurredAt) < new Date(lastOccurredAt) ||
            (occurredAt === lastOccurredAt &&
              shopifyDomain !== lastShopifyDomain)
          );
        });

        if (filteredEvents.length) {
          const length = filteredEvents.length;
          const oldestEvent = filteredEvents[length - 1];

          oldestOccurredAt = oldestEvent.occurredAt;
          oldestShopifyDomain = oldestEvent.shop.myshopifyDomain;

          if (oldestOccurredAt) {
            await this.cacheManager.set(lastOccurredAtKey, oldestOccurredAt);
            await this.cacheManager.set(backupOccurredAtKey, oldestOccurredAt);
          }

          if (oldestShopifyDomain) {
            await this.cacheManager.set(
              lastShopifyDomainKey,
              oldestShopifyDomain,
            );
            await this.cacheManager.set(
              backupShopifyDomainKey,
              oldestShopifyDomain,
            );
          }

          // console.log('Filtered Events Length:', filteredEvents.length);
          // console.log('Filtered Event Details:', filteredEvents);

          return filteredEvents;
        } else {
          // console.log('No new events found. Marking app as synced.');
          await this.updateProjectSyncStatus(appId, true);

          if (lastOccurredAt) {
            await this.cacheManager.set(backupOccurredAtKey, lastOccurredAt);
          }

          if (lastShopifyDomain) {
            await this.cacheManager.set(
              backupShopifyDomainKey,
              lastShopifyDomain,
            );
          }

          await this.cacheManager.del(lastOccurredAtKey);
          await this.cacheManager.del(lastShopifyDomainKey);

          return null;
        }
      } else {
        // console.log('No events found. Marking app as synced.');
        await this.updateProjectSyncStatus(appId, true);

        if (lastOccurredAt) {
          await this.cacheManager.set(backupOccurredAtKey, lastOccurredAt);
        }

        if (lastShopifyDomain) {
          await this.cacheManager.set(
            backupShopifyDomainKey,
            lastShopifyDomain,
          );
        }

        await this.cacheManager.del(lastOccurredAtKey);
        await this.cacheManager.del(lastShopifyDomainKey);

        return null;
      }
    } catch (error) {
      console.error('Failed to fetch and store data:', error);
      throw new Error('Failed to fetch data');
    }
  }

  async fetchEventsAfterLastOccurredAt(app) {
    const { appId, partnerId, accessToken } = app;

    const lastOccurredAtKey = `${appId}:lastOccurredAt`;
    const backupOccurredAtKey = `${appId}:backup:lastOccurredAt`;

    let lastOccurredAt = await this.cacheManager.get<string>(lastOccurredAtKey);
    if (!lastOccurredAt) {
      lastOccurredAt = await this.cacheManager.get<string>(backupOccurredAtKey);
    }

    const query = APP_INSTALLS_UNINSTALLS_AFTER_QUERY(appId, lastOccurredAt);

    try {
      const response = await axios.post(
        `https://partners.shopify.com/${partnerId}/api/2024-10/graphql.json`,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
        },
      );

      const data = response.data.data;
      const events = data?.app?.events?.edges || [];

      // console.log('Received events data after lastOccurredAt:', data);

      if (events.length) {
        const eventResponses = events.map((edge) => edge.node);

        const newEvents = eventResponses.filter(
          (event) => new Date(event.occurredAt) > new Date(lastOccurredAt),
        );

        if (newEvents.length) {
          const latestEvent = newEvents[0];
          const latestOccurredAt = latestEvent.occurredAt;

          if (latestOccurredAt) {
            await this.cacheManager.set(lastOccurredAtKey, latestOccurredAt);
          }

          // console.log('Filtered new events:', newEvents);
          // console.log('Latest event occurred At:', latestOccurredAt);

          return newEvents;
        } else {
          // console.log('No new events after filtering ...');
          return null;
        }
      } else {
        console.log('No events found after lastOccurredAt.');
        return null;
      }
    } catch (error) {
      console.error('Error in new cron:', error.message);
    }
  }

  private async updateProjectSyncStatus(appId: string, isSynced: boolean) {
    const project = await prisma.project.findFirst({
      where: {
        data: {
          path: ['appId'],
          equals: appId,
        },
      },
    });

    if (project) {
      await prisma.project.update({
        where: { id: project.id },
        data: { isSynced },
      });
    } else {
      console.error('Project not found for appId:', appId);
    }
  }
}