import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import axios from 'axios';
import { PrismaService } from '@org/data-source';
import { LeadActivitySyncService } from './LeadActivity.Sync.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('relationship-events')
    private readonly appEventsQueue: Queue,
    private readonly LeadActivitySyncService: LeadActivitySyncService,
    private readonly PrismaService: PrismaService,
  ) {}

  @Cron('*/5 * * * * *')
  async handleCron() {
    const apps: [] = await this.PrismaService.$queryRaw`
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
          await this.LeadActivitySyncService.fetchAndStoreData(app);

        if (events && events.length) {
          const payload = { app, events };

          await this.appEventsQueue.add('APP_INSTALLED_BY_NEW_LEAD', payload);
        }
      }),
    );
  }

  @Cron('*/5 * * * * *')
  async handleCron2() {
    const apps: [] = await this.PrismaService.$queryRaw`
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

    await Promise.all(
      apps.map(async (app) => {
        const events =
          await this.LeadActivitySyncService.fetchEventsAfterLastOccurredAt(
            app,
          );

        if (events && events.length) {
          for (const event of events) {
            const { type: eventType, ...eventData } = event;

            const payload = {
              app,
              eventType,
              event: eventData,
            };

            console.log(
              JSON.stringify(payload) +
                '------------------------------------------------------------------',
            );
            await this.appEventsQueue.add('relationship-events', payload);
          }
        }
      }),
    );
  }
}
