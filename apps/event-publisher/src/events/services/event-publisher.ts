import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RelationshipEventPublisher } from '../event-types/relationship/relationship-event.publisher';
import { EventPublisher } from 'src/common/interfaces/event.interface';
import { EventDto } from 'src/events/dto/event.dto';
import { CreditEventPublisher } from '../event-types/credit/credit-event.publisher'; // Adjust the import paths
import { OneTimeChargeEventPublisher } from '../event-types/one-time-charge/one-time-charge-event.publisher'; // Adjust the import paths
import { SubscriptionEventPublisher } from '../event-types/subscription/subscription-event.publisher'; 

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);

  private readonly publishers: { [key: string]: EventPublisher };

  constructor(
    private readonly relationshipEventPublisher: RelationshipEventPublisher,
    private readonly creditEventPublisher: CreditEventPublisher,
    private readonly oneTimeChargeEventPublisher: OneTimeChargeEventPublisher,
    private readonly subscriptionEventPublisher: SubscriptionEventPublisher,
  ) {
    this.publishers = {
      'relationship-events': this.relationshipEventPublisher,
      'credit-events': this.creditEventPublisher,
      'one-time-charge-events': this.oneTimeChargeEventPublisher,
      'subscription-events': this.subscriptionEventPublisher,
    };
  }

  async publishEvent(eventPayload: EventDto, eventType: string): Promise<void> {
    const publisher = this.publishers[eventType];
    if (!publisher) {
      throw new NotFoundException(`Publisher not found for event type: ${eventType}`);
    }
    try {
      await publisher.publish(eventPayload);
    } catch (error) {
      this.logger.error(`Failed to publish event of type ${eventType}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
