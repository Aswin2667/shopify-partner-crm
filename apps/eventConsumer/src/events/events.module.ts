import { Module } from '@nestjs/common';
import { EventConsumer } from './event.consumer';
import { RelationshipInstalledStrategy } from './strategies/relationship/relationship-installed.strategy';
import { BullMQModule } from 'src/bullmq/bullmq.client';
import { CreditAppliedStrategy } from './strategies/credits/credit-applied.strategy';
import { CreditFailedStrategy } from './strategies/credits/credit-failed.strategy';
import { CreditPendingStrategy } from './strategies/credits/credit-pending.strategy';
import { OneTimeChargeAcceptedStrategy } from './strategies/one-time-charges/one-time-charge-accepted.strategy';
import { OneTimeChargeActivatedStrategy } from './strategies/one-time-charges/one-time-charge-activated.strategy';
import { OneTimeChargeDeclinedStrategy } from './strategies/one-time-charges/one-time-charge-declined.strategy';
import { OneTimeChargeExpiredStrategy } from './strategies/one-time-charges/one-time-charge-expired.strategy';
import { RelationshipDeactivatedStrategy } from './strategies/relationship/relationship-deactivated.strategy';
import { RelationshipReactivatedStrategy } from './strategies/relationship/relationship-reactivated.strategy';
import { RelationshipUninstalledStrategy } from './strategies/relationship/relationship-uninstalled.strategy';
import { SubscriptionApproachingCappedAmountStrategy } from './strategies/subscriptions/subscription-approaching-capped-amount.strategy';
import { SubscriptionCappedAmountUpdatedStrategy } from './strategies/subscriptions/subscription-capped-amount-updated.strategy';
import { SubscriptionChargeAcceptedStrategy } from './strategies/subscriptions/subscription-charge-accepted.strategy';
import { SubscriptionChargeActivatedStrategy } from './strategies/subscriptions/subscription-charge-activated.strategy';
import { SubscriptionChargeCanceledStrategy } from './strategies/subscriptions/subscription-charge-canceled.strategy';
import { SubscriptionChargeDeclinedStrategy } from './strategies/subscriptions/subscription-charge-declined.strategy';
import { SubscriptionChargeExpiredStrategy } from './strategies/subscriptions/subscription-charge-expired.strategy';
import { SubscriptionChargeFrozenStrategy } from './strategies/subscriptions/subscription-charge-frozen.strategy';
import { SubscriptionChargeUnfrozenStrategy } from './strategies/subscriptions/subscription-charge-unfrozen.strategy';

@Module({
  imports: [BullMQModule],
  providers: [ 
    EventConsumer,
    RelationshipInstalledStrategy,
    RelationshipUninstalledStrategy,
    CreditAppliedStrategy,
    CreditFailedStrategy,
    CreditPendingStrategy,
    OneTimeChargeAcceptedStrategy,
    OneTimeChargeActivatedStrategy,
    OneTimeChargeDeclinedStrategy,
    OneTimeChargeExpiredStrategy,
    RelationshipReactivatedStrategy,
    RelationshipDeactivatedStrategy,
    SubscriptionApproachingCappedAmountStrategy,
    SubscriptionCappedAmountUpdatedStrategy,
    SubscriptionChargeAcceptedStrategy,
    SubscriptionChargeActivatedStrategy,
    SubscriptionChargeCanceledStrategy,
    SubscriptionChargeDeclinedStrategy,
    SubscriptionChargeExpiredStrategy,
    SubscriptionChargeFrozenStrategy,
    SubscriptionChargeUnfrozenStrategy,
  ],
})
export class EventsModule {}
