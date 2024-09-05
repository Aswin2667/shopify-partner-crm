import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Install_uninstall_dataService } from './app-data/install_uninstall.service';
import prisma from './shared/utlis/prisma';
import axios from 'axios';


@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('install_uninstall_events') private readonly appEventsQueue: Queue,
    private readonly installUninstallService: Install_uninstall_dataService,
  ) {}

  @Cron('*/5 * * * * *')
  async handleCron() {

    const apps: [] = await prisma.$queryRaw`
      SELECT 
        i."id" AS "integrationId",
        i."organizationId" AS "organizationId",
        i.data->>'partnerId' AS "partnerId",
        i.data->>'accessToken' AS "accessToken",
        p.data->>'appId' AS "appId",
        p."name" AS "name",
        p."id" AS "projectId"
      FROM 
        "Integration" i
      JOIN 
        "Project" p 
      ON 
        i."id" = p."integrationId"
      WHERE 
        p."isSynced" = false`;

    // console.log('Apps to be processed:', apps);

    await Promise.all(apps.map(async (app) => {
      const events = await this.installUninstallService.fetchAndStoreData(app);

      if (events && events.length) {
        const payload = { app, events };
        await this.appEventsQueue.add('APP_INSTALLED_UNINSTALLED', payload);
      }
    }));
  }


  @Cron('*/5 * * * * *')
  async handleCron2() {
    // console.log('Running cron job every 5 seconds...');

    const apps: [] = await prisma.$queryRaw`
      SELECT 
        i."id" AS "integrationId",
        i."organizationId" AS "organizationId",
        i.data->>'partnerId' AS "partnerId",
        i.data->>'accessToken' AS "accessToken",
        p.data->>'appId' AS "appId",
        p."name" AS "name",
        p."id" AS "projectId"
      FROM 
        "Integration" i
      JOIN 
        "Project" p 
      ON 
        i."id" = p."integrationId"
`;

    // console.log('Apps to be processed:', apps);

    await Promise.all(apps.map(async (app) => {
      const events = await this.installUninstallService.fetchEventsAfterLastOccurredAt(app);

      if (events && events.length) {
        const payload = { app, events };
        await this.appEventsQueue.add('APP_INSTALLED_UNINSTALLED_AFTER', payload);
      }
    }));
  }
  @Cron('*/5 * * * * *')
  async handleCron445() {
    const query = `query subscriptionChargeActivated {
      app(id: "gid://partners/App/27059027969") {
        id
        events(
          first: 100
          types: [SUBSCRIPTION_CHARGE_CANCELED]
        ) {
          edges {
            node {
              ...subscriptionChargeActivated
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }
  
    fragment subscriptionChargeActivated on AppEvent {
      ... on SubscriptionChargeActivated {
        type
        shop {
          id
          myshopifyDomain
        }
        charge {
          amount {
            amount
            currencyCode
          }
          billingOn
          id
          name
          test
        }
        occurredAt
      }
        ... on SubscriptionChargeUnfrozen {
        type
        }
        ... on SubscriptionChargeCanceled {
        type
        }
    }`;
  
    try {
      const response = await axios.post(
        `https://partners.shopify.com/2798960/api/2024-10/graphql.json`,
        { query }, // Pass the query inside the post body
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': "prtapi_6757d0479509b34c820def78a94ad989",
          },
        }
      );
      
      // Log the response data
      console.log('Response Data:', response.data.data.app.events.edges);
    } catch (error) {
      // Log any errors
      console.error('Error:', error.response?.data || error.message);
    }
  }
}