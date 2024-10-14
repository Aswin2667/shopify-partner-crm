import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import prisma from 'src/utils/PrismaService';
 import axios from 'axios';
import { LeadActivitySyncService } from './LeadActivity.Sync.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('app_events_queue')
    private readonly appEventsQueue: Queue,
    private readonly installUninstallService:LeadActivitySyncService ,
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

    await Promise.all(
      apps.map(async (app) => {
        const events =
          await this.installUninstallService.fetchAndStoreData(app);

        if (events && events.length) {
          const payload = { app, events };
          await this.appEventsQueue.add('APP_INSTALLED_UNINSTALLED', payload);
        }
      }),
    );
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

    await Promise.all(
      apps.map(async (app) => {
        const events =
          await this.installUninstallService.fetchEventsAfterLastOccurredAt(
            app,
          );

        if (events && events.length) {
          const payload = { app, events };
          await this.appEventsQueue.add(
            'APP_INSTALLED_UNINSTALLED_AFTER',
            payload,
          );
        }
      }),
    );
  }
}