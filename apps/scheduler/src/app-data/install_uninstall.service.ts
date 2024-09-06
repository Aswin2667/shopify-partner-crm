import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import axios from 'axios';
import { APP_INSTALLS_UNINSTALLS_AFTER_QUERY, APP_INSTALLS_UNINSTALLS_QUERY } from 'src/graphql/install_uninstall_query';
import prisma from 'src/shared/utlis/prisma';
import { SUBSCRIPTION_CHARGE_AFTER_QUERY, SUBSCRIPTION_CHARGE_QUERY } from 'src/graphql/subscription_charge_activated_query';

@Injectable()
export class Install_uninstall_dataService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async fetchAndStoreData(app, eventType: 'install_uninstall' | 'subscription') {
    const { appId, partnerId, accessToken } = app;
    
    const lastOccurredAtKey = `${appId}:${eventType}:lastOccurredAt`;
    const lastShopifyDomainKey = `${appId}:${eventType}:shopifyDomain`;
    const backupOccurredAtKey = `${appId}:${eventType}:backup:lastOccurredAt`;
    const backupShopifyDomainKey = `${appId}:${eventType}:backup:shopifyDomain`;

    const lastOccurredAt = await this.cacheManager.get<string>(lastOccurredAtKey);
    const lastShopifyDomain = await this.cacheManager.get<string>(lastShopifyDomainKey);

    const query = eventType === 'subscription'
      ? SUBSCRIPTION_CHARGE_QUERY(appId, lastOccurredAt)
      : APP_INSTALLS_UNINSTALLS_QUERY(appId, lastOccurredAt);

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

      if (events.length) {
        let oldestOccurredAt = lastOccurredAt;
        let oldestShopifyDomain = lastShopifyDomain;

        const eventResponses = events.map(edge => edge.node);
        const uniqueEvents = new Set();
        
        const filteredEvents = eventResponses.filter(event => {
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
            (occurredAt === lastOccurredAt && shopifyDomain !== lastShopifyDomain)
          );
        });

        if (filteredEvents.length) {
          const length = filteredEvents.length;
          const oldestEvent = filteredEvents[length-1];
          
          oldestOccurredAt = oldestEvent.occurredAt;
          oldestShopifyDomain = oldestEvent.shop.myshopifyDomain;

          if (oldestOccurredAt) {
            await this.cacheManager.set(lastOccurredAtKey, oldestOccurredAt);
            await this.cacheManager.set(backupOccurredAtKey, oldestOccurredAt);
          }

          if (oldestShopifyDomain) {
            await this.cacheManager.set(lastShopifyDomainKey, oldestShopifyDomain);
            await this.cacheManager.set(backupShopifyDomainKey, oldestShopifyDomain);
          }

          return filteredEvents;
        } else {
          await this.updateProjectSyncStatus(appId, true);
          
          if (lastOccurredAt) {
            await this.cacheManager.set(backupOccurredAtKey, lastOccurredAt);
          }

          if (lastShopifyDomain) {
            await this.cacheManager.set(backupShopifyDomainKey, lastShopifyDomain);
          }

          await this.cacheManager.del(lastOccurredAtKey);
          await this.cacheManager.del(lastShopifyDomainKey);

          return null;
        }
      } else {
        await this.updateProjectSyncStatus(appId, true);

        if (lastOccurredAt) {
          await this.cacheManager.set(backupOccurredAtKey, lastOccurredAt);
        }

        if (lastShopifyDomain) {
          await this.cacheManager.set(backupShopifyDomainKey, lastShopifyDomain);
        }

        await this.cacheManager.del(lastOccurredAtKey);
        await this.cacheManager.del(lastShopifyDomainKey);

        return null;
      }
    } catch (error) {
      console.error('Failed to fetch and store data:', error.message);
      throw new Error('Failed to fetch data');
    }
  }

  async fetchEventsAfterLastOccurredAt(app, eventType: 'install_uninstall' | 'subscription') {
    const { appId, partnerId, accessToken } = app;

    const lastOccurredAtKey = `${appId}:${eventType}:lastOccurredAt`;
    const backupOccurredAtKey = `${appId}:${eventType}:backup:lastOccurredAt`;

    let lastOccurredAt = await this.cacheManager.get<string>(lastOccurredAtKey);
    if (!lastOccurredAt) {
      lastOccurredAt = await this.cacheManager.get<string>(backupOccurredAtKey);
    }

    const query = eventType === 'subscription'
      ? SUBSCRIPTION_CHARGE_AFTER_QUERY(appId, lastOccurredAt)
      : APP_INSTALLS_UNINSTALLS_AFTER_QUERY(appId, lastOccurredAt);

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

      if (events.length) {
        const eventResponses = events.map(edge => edge.node);
        const uniqueEvents = new Set();
        
        const filteredEvents = eventResponses.filter(event => {
          const occurredAt = event.occurredAt;
          const shopifyDomain = event.shop.myshopifyDomain;

          const eventIdentifier = `${occurredAt}-${shopifyDomain}`;
          
          if (uniqueEvents.has(eventIdentifier)) {
            return false;
          }

          uniqueEvents.add(eventIdentifier);

          return (
            new Date(occurredAt) > new Date(lastOccurredAt)
          );
        });

        if (filteredEvents.length) {
          const oldestEvent = filteredEvents[0];
          const oldestOccurredAt = oldestEvent.occurredAt;

          if (oldestOccurredAt) {
            await this.cacheManager.set(lastOccurredAtKey, oldestOccurredAt);
            await this.cacheManager.set(backupOccurredAtKey, oldestOccurredAt);
          }

          return filteredEvents;
        } else {
          await this.updateProjectSyncStatus(appId, true);
          
          if (lastOccurredAt) {
            await this.cacheManager.set(backupOccurredAtKey, lastOccurredAt);
          }

          await this.cacheManager.del(lastOccurredAtKey);

          return null;
        }
      } else {
        await this.updateProjectSyncStatus(appId, true);
        
        if (lastOccurredAt) {
          await this.cacheManager.set(backupOccurredAtKey, lastOccurredAt);
        }

        await this.cacheManager.del(lastOccurredAtKey);

        return null;
      }
    } catch (error) {
      console.error('Failed to fetch events after last occurred at:', error.message);
      throw new Error('Failed to fetch events');
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

