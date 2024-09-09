import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Install_uninstall_dataService } from './app-data/install_uninstall.service';
import prisma from './shared/utlis/prisma';
import { GET_APPS_AFTER_LAST_OCCURRED_AT, GET_UNSYNCED_APPS } from './queries/app_queries';
import axios from 'axios';


@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('install_uninstall_events') private readonly appEventsQueue: Queue,
    @InjectQueue('subscription_events') private readonly subscriptionEventsQueue: Queue,
    @InjectQueue('credit_events') private readonly creditEventsQueue: Queue,
    private readonly installUninstallService: Install_uninstall_dataService,
  ) {}


@Cron('*/5 * * * * *')
async handleAppEvents() {
  // Fetch unsynced apps
  const apps: [] = await prisma.$queryRawUnsafe(GET_UNSYNCED_APPS);

  // Process install/uninstall events
  await Promise.all(apps.map(async (app) => {
    const installUninstallEvents = await this.installUninstallService.fetchAndStoreData(app, 'install_uninstall');

    if (installUninstallEvents && installUninstallEvents.length) {
      const installUninstallPayload = { app, events: installUninstallEvents };
      await this.appEventsQueue.add('APP_INSTALLED_UNINSTALLED', installUninstallPayload);
    }
  }));

  // Process subscription events
  await Promise.all(apps.map(async (app) => {
    const subscriptionEvents = await this.installUninstallService.fetchAndStoreData(app, 'subscription');

    if (subscriptionEvents && subscriptionEvents.length) {
      const subscriptionPayload = { app, events: subscriptionEvents };
      await this.subscriptionEventsQueue.add('APP_SUBSCRIPTION', subscriptionPayload);
    }
  }));

  // Process credit events
  await Promise.all(apps.map(async (app) => {
    const creditEvents = await this.installUninstallService.fetchAndStoreData(app, 'credit');
    if (creditEvents && creditEvents.length) {
      const creditPayload = { app, events: creditEvents };
      await this.creditEventsQueue.add('APP_CREDIT_EVENTS', creditPayload);
    }
  }));

}



  @Cron('*/20 * * * * *')
  async installUninstallEventsAfterLastOccurredAt() {

    const apps: [] = await prisma.$queryRawUnsafe(GET_APPS_AFTER_LAST_OCCURRED_AT)


    await Promise.all(apps.map(async (app) => {
      const events = await this.installUninstallService.fetchEventsAfterLastOccurredAt(app, 'install_uninstall');

      if (events && events.length) {
        const payload = { app, events };
        await this.appEventsQueue.add('APP_INSTALLED_UNINSTALLED_AFTER', payload);
      }
    }));
  }

  @Cron('*/20 * * * * *')
  async susbscriptionAppEventsAfterLastOccurredAt() {

    const apps: [] = await prisma.$queryRawUnsafe(GET_APPS_AFTER_LAST_OCCURRED_AT)


    await Promise.all(apps.map(async (app) => {
      const events = await this.installUninstallService.fetchEventsAfterLastOccurredAt(app, 'subscription');

      if (events && events.length) {
        const payload = { app, events };
        await this.subscriptionEventsQueue.add('APP_SUBSCRIPTION_AFTER', payload);
      }
    }));

  }

  @Cron('*/20 * * * * *')
  async creditEventsAfterLastOccurredAt() {
    const apps: [] = await prisma.$queryRawUnsafe(GET_APPS_AFTER_LAST_OCCURRED_AT);

    await Promise.all(apps.map(async (app) => {
      const creditEvents = await this.installUninstallService.fetchEventsAfterLastOccurredAt(app, 'credit');
      if (creditEvents && creditEvents.length) {
        const payload = { app, events: creditEvents };
        await this.creditEventsQueue.add('APP_CREDIT_EVENTS_AFTER', payload);
      }
    }));
  }

}