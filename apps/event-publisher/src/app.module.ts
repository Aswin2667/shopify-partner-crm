import { Module } from '@nestjs/common';
import { BullMQModule } from './bullMqClient/bullMq.module';
import { EventsController } from './events/controller/relationship.events.controller';
import { EventPublisherService } from './events/services/event-publisher';
import { RelationshipEventPublisher } from './events/event-types/relationship/relationship-event.publisher';
import { CreditEventPublisher } from './events/event-types/credit/credit-event.publisher';
import { OneTimeChargeEventPublisher } from './events/event-types/one-time-charge/one-time-charge-event.publisher';
import { SubscriptionEventPublisher } from './events/event-types/subscription/subscription-event.publisher';

@Module({
  imports: [BullMQModule],
  controllers: [EventsController],
  providers: [EventPublisherService,RelationshipEventPublisher,CreditEventPublisher,OneTimeChargeEventPublisher,SubscriptionEventPublisher],
})
export class AppModule {}
