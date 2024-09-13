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

  @Cron('*/1 * * * * *')
  async handleCron() {
    console.log("345345345345")

    const eventData = {
      eventType: 'RELATIONSHIP_INSTALLED',
      eventId: 'eventPayload.eventId', // Ensure these fields are included in EventDto
      timestamp: '2024-09-13T12:34:56Z', // or use eventPayload.timestamp if available
      eventSource: 'user-service',
      actor: {
        id: 'admin_001',
        type: 'USER', //
      },
      payload: {
        id: 'eventPayload.id',
      },
      metadata: {
        eventSource: 'user-service',
        version: '1.0',
        priority: 'high',
      },
    };

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
          console.log(payload);
          // await this.appEventsQueue.add('APP_INSTALLED_BY_NEW_LEAD', payload);
          // const endpoint = this.getEndpointForEvent(eventType);
          //   if (endpoint !== 'unknown') {
          //     await this.postEvent(
          //       eventType,
          //       eventType === 'RELATIONSHIP_INSTALLED' ? eventData : eventData2,
          //       endpoint,
          //     );
          //   }
          // console.log(payload);
        }
      }),
    );
  }

  @Cron('*/5 * * * * *')
  async handleCron2() {
    console.log("sdfsdf")
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

            const eventData2 = {
              eventType: eventType,
              eventId: 'eventPayload.eventId',
              timestamp: '2024-09-13T12:34:56Z',
              actor: {
                id: '4',
                type: 'SCHEDULER',
              },
              payload,
              metadata: {
                eventSource: 'scheduler-service',
                version: '1.0',
                priority: 'high',
              },
            };

            // Handle Axios post calls based on the event type
            const endpoint = this.getEndpointForEvent(eventType);
            if (endpoint !== 'unknown') {
              await this.postEvent(
                eventType,
                eventType === 'RELATIONSHIP_INSTALLED' ? eventData : eventData2,
                endpoint,
              );
            }

            // Add the event to BullMQ queue
            await this.appEventsQueue.add('relationship-events', eventData2);
          }
        }
      }),
    );
  }
  private async postEvent(eventType: string, eventData: any, endpoint: string) {
    try {
      const response = await axios.post(
        `http://localhost:8085/events/${endpoint}`,
        eventData,
      );
      console.log(response);
    } catch (error) {
      console.error(`Error posting ${eventType} event:`, error);
    }
  }

  private getEndpointForEvent(eventType: string): string {
    switch (eventType) {
      case 'RELATIONSHIP_INSTALLED':
      case 'RELATIONSHIP_UNINSTALLED':
      case 'RELATIONSHIP_REACTIVATED':
      case 'RELATIONSHIP_DEACTIVATED':
        return 'relationship';
      case 'CREDIT_APPLIED':
      case 'CREDIT_FAILED':
      case 'CREDIT_PENDING':
        return 'credit';
      case 'ONE_TIME_CHARGE_ACCEPTED':
      case 'ONE_TIME_CHARGE_ACTIVATED':
      case 'ONE_TIME_CHARGE_DECLINED':
      case 'ONE_TIME_CHARGE_EXPIRED':
        return 'one-time-charge';
      case 'SUBSCRIPTION_CAPPED_AMOUNT_UPDATED':
      case 'SUBSCRIPTION_CAPPED_AMOUNT_UPDATED':
      case 'SUBSCRIPTION_CHARGE_ACCEPTED':
      case 'SUBSCRIPTION_CHARGE_ACTIVATED':
      case 'SUBSCRIPTION_CHARGE_CANCELED':
      case 'SUBSCRIPTION_CHARGE_DECLINED':
      case 'SUBSCRIPTION_CHARGE_EXPIRED':
      case 'SUBSCRIPTION_CHARGE_FROZEN':
      case 'SUBSCRIPTION_CHARGE_UNFROZEN':
        return 'subscription';
      default:
        return 'unknown';
    }
  }
}
