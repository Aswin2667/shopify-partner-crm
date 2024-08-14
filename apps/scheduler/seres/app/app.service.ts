import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GraphQLService } from 'seres/graphql/graphql.service';
import { PrismaService } from 'seres/prisma/prisma.service';

@Injectable()
export class AppService {
  private lastCursor: string | null = null;

  constructor(
    private readonly graphQLService: GraphQLService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    await this.fetchAndStoreShopifyEvents();
  }

  private async fetchAndStoreShopifyEvents() {
    try {
      // const events = await this.graphQLService.fetchShopifyEvents(this.lastCursor);

      // if (events.length > 0) {
      //   for (const event of events) {
      //     const store = event.node;

      //     console.log(store);
      //   }

      //   this.lastCursor = events[events.length - 1].cursor;
      // } else {
      //   console.log('No new events found');
      // }
    } catch (error) {
      console.error('Failed to fetch and store Shopify events:', error.message);
    }
  }
}
