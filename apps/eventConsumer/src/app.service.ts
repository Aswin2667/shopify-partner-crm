import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RelationshipInstalledStrategy } from './events/strategies/relationship/relationship-installed.strategy';
 
@Injectable()
export class CronService {
  constructor(
    private readonly relationshipInstalledStrategy: RelationshipInstalledStrategy,
  ) {}

  // Cron job that runs every minute (or use a different time for faster testing)
  @Cron(CronExpression.EVERY_MINUTE)
  async triggerRelationshipInstalledEvent() {
    console.log('Cron Job: Triggering Relationship Installed Event');

    const testData = { id: 1, name: 'Test Event', details: 'Sample details' };

    // Call the handle method with test data
    await this.relationshipInstalledStrategy.handle(testData);
  }
}
