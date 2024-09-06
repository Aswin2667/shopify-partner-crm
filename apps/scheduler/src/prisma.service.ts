import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import prisma from './shared/utlis/prisma';
import { APP_INSTALLS_UNINSTALLS_QUERY } from './graphql/install_uninstall_query';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('install_uninstall_events') private readonly appEventsQueue: Queue,
  ) { }

  // Cron job that runs every 10 seconds
  @Cron('*/5 * * * * *')
  async handleCron() {
    console.log('Running cron job every 10 seconds...');

    const apps: [] = await prisma.$queryRaw`
      SELECT 
        i."id" AS "integrationId",
        i."organizationId" AS "organizationId",
        i.data->>'partnerId' AS "partnerId",
        i.data->>'accessToken' AS "accessToken",
        p.data->>'appId' AS "appId",
        p."id" AS "projectId"
      FROM 
        "Integration" i
      JOIN 
        "Project" p 
      ON 
        i."id" = p."integrationId"
      WHERE 
        p."isSynced" = false`;

    console.log(apps)

    await Promise.all(apps.map(async (app) => {

      const events = await this.fetchAndStoreData(app);

      if (events && events.length) {
        const payload = { app, events };
        await this.appEventsQueue.add('APP_INSTALLED_UNINSTALLED', payload);
      }
    }));
  }

  async fetchAndStoreData(app) {
    const { appId, partnerId, accessToken } = app;

    const lastOccurredAtKey = `lastOccurredAt_${appId}`;
    const lastShopifyDomainKey = `shopifyDomain_${appId}`;

    // Retrieve the last occurredAt and shopifyDomain values from Redis
    const lastOccurredAt = await this.cacheManager.get<string>(lastOccurredAtKey);
    const lastShopifyDomain = await this.cacheManager.get<string>(lastShopifyDomainKey);

    // Query from another separate file
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
      console.log(data)
      
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

        // Update Redis with the oldest occurredAt and shopifyDomain
        await this.cacheManager.set(lastOccurredAtKey, oldestOccurredAt);
        await this.cacheManager.set(lastShopifyDomainKey, oldestShopifyDomain);

        // If the oldest occurredAt is the same as the lastOccurredAt, mark the app as synced
        if (lastOccurredAt === oldestOccurredAt) {
          console.log('No new events found since the last check. Marking app as synced.');
          // await this.updateProjectSyncStatus(appId, true);
          // await this.cacheManager.del(lastOccurredAtKey);
          // await this.cacheManager.del(lastShopifyDomainKey);
        }

        // Log filtered events
        console.log('Filtered Events Length:', filteredEvents.length);
        console.log('Filtered Event Details:', filteredEvents);

        return filteredEvents;
      } else {
        console.log('No new events found. Marking app as synced.');
        await this.updateProjectSyncStatus(appId, true);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch and store data:', error.message);
      throw new Error('Failed to fetch data');
    }
  }

  private async updateProjectSyncStatus(appId: string, isSynced: boolean) {
    // Find the project using the appId
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
