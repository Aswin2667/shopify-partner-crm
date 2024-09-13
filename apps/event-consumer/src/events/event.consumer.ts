import { Injectable, OnModuleInit } from '@nestjs/common';
import { BullMQClient } from 'src/bullmq/bullmq.module';
import { CreditAppliedStrategy } from './strategies/credits/credit-applied.strategy';
import { OneTimeChargeAcceptedStrategy } from './strategies/one-time-charges/one-time-charge-accepted.strategy';
import { OneTimeChargeActivatedStrategy } from './strategies/one-time-charges/one-time-charge-activated.strategy';
import { OneTimeChargeDeclinedStrategy } from './strategies/one-time-charges/one-time-charge-declined.strategy';
import { OneTimeChargeExpiredStrategy } from './strategies/one-time-charges/one-time-charge-expired.strategy';
import { RelationshipDeactivatedStrategy } from './strategies/relationship/relationship-deactivated.strategy';
import { RelationshipInstalledStrategy } from './strategies/relationship/relationship-installed.strategy';
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
import { CreditFailedStrategy } from './strategies/credits/credit-failed.strategy';
import { CreditPendingStrategy } from './strategies/credits/credit-pending.strategy';

@Injectable()
export class EventConsumer implements OnModuleInit {
  constructor(
    private readonly bullMQClient: BullMQClient,
    // Relationship event strategies
    private readonly relationshipInstalledStrategy: RelationshipInstalledStrategy,
    private readonly relationshipUninstalledStrategy: RelationshipUninstalledStrategy,
    private readonly relationshipReactivatedStrategy: RelationshipReactivatedStrategy,
    private readonly relationshipDeactivatedStrategy: RelationshipDeactivatedStrategy,
    // Credit event strategies
    private readonly creditAppliedStrategy: CreditAppliedStrategy,
    private readonly creditFailedStrategy: CreditFailedStrategy,
    private readonly creditPendingStrategy: CreditPendingStrategy,
    // One-time charge event strategies
    private readonly oneTimeChargeAcceptedStrategy: OneTimeChargeAcceptedStrategy,
    private readonly oneTimeChargeActivatedStrategy: OneTimeChargeActivatedStrategy,
    private readonly oneTimeChargeDeclinedStrategy: OneTimeChargeDeclinedStrategy,
    private readonly oneTimeChargeExpiredStrategy: OneTimeChargeExpiredStrategy,   
    // Subscription event strategies
    private readonly subscriptionApproachingCappedAmountStrategy: SubscriptionApproachingCappedAmountStrategy,
    private readonly subscriptionCappedAmountUpdatedStrategy: SubscriptionCappedAmountUpdatedStrategy,
    private readonly subscriptionChargeAcceptedStrategy: SubscriptionChargeAcceptedStrategy,
    private readonly subscriptionChargeActivatedStrategy: SubscriptionChargeActivatedStrategy,
    private readonly subscriptionChargeCanceledStrategy: SubscriptionChargeCanceledStrategy,
    private readonly subscriptionChargeDeclinedStrategy: SubscriptionChargeDeclinedStrategy,
    private readonly subscriptionChargeExpiredStrategy: SubscriptionChargeExpiredStrategy,
    private readonly subscriptionChargeFrozenStrategy: SubscriptionChargeFrozenStrategy,
    private readonly subscriptionChargeUnfrozenStrategy: SubscriptionChargeUnfrozenStrategy,
  ) {}

  onModuleInit() {
    this.createRelationshipQueueWorker();
    this.createCreditQueueWorker();
    this.createOneTimeChargeQueueWorker();
    this.createSubscriptionQueueWorker();
  }

  private createRelationshipQueueWorker() {
    this.bullMQClient.createWorker('relationship-events', async (job) => {
      const eventType = job.data.eventType;
      const eventData = job.data;
      console.log('Received event:', eventType, eventData);
      switch (eventType) {
        case 'RELATIONSHIP_INSTALLED':
          await this.relationshipInstalledStrategy.handle(eventData);
          break;
        case 'RELATIONSHIP_UNINSTALLED':
          await this.relationshipUninstalledStrategy.handle(eventData);
          break;
        case 'RELATIONSHIP_REACTIVATED':
          await this.relationshipReactivatedStrategy.handle(eventData);
          break;
        case 'RELATIONSHIP_DEACTIVATED':
          await this.relationshipDeactivatedStrategy.handle(eventData);
          break;
        default:
          console.error(`Unknown relationship event type: ${eventType}`);
      }
    });
  }

  private createCreditQueueWorker() {
    this.bullMQClient.createWorker('credit-events', async (job) => {
      const eventType = job.data.eventType;
      const eventData = job.data;

      switch (eventType) {
        case 'CREDIT_APPLIED':
          await this.creditAppliedStrategy.handle(eventData);
          break;
        case 'CREDIT_FAILED':
          await this.creditFailedStrategy.handle(eventData);
          break;
        case 'CREDIT_PENDING':
          await this.creditPendingStrategy.handle(eventData);
          break;
        default:
          console.error(`Unknown credit event type: ${eventType}`);
      }
    });
  }

  private createOneTimeChargeQueueWorker() {
    this.bullMQClient.createWorker('one-time-charge-events', async (job) => {
      const eventType = job.data.eventType;
      const eventData = job.data;

      switch (eventType) {
        case 'ONE_TIME_CHARGE_ACCEPTED':
          await this.oneTimeChargeAcceptedStrategy.handle(eventData);
          break;
        case 'ONE_TIME_CHARGE_ACTIVATED':
          await this.oneTimeChargeActivatedStrategy.handle(eventData);
          break;
        case 'ONE_TIME_CHARGE_DECLINED':
          await this.oneTimeChargeDeclinedStrategy.handle(eventData);
          break;
        case 'ONE_TIME_CHARGE_EXPIRED':
          await this.oneTimeChargeExpiredStrategy.handle(eventData);
          break;
        default:
          console.error(`Unknown one-time charge event type: ${eventType}`);
      }
    });
  }

  private createSubscriptionQueueWorker() {
    this.bullMQClient.createWorker('subscription-events', async (job) => {
      const eventType = job.data.eventType;
      const eventData = job.data;

      switch (eventType) {
        case 'SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT':
          await this.subscriptionApproachingCappedAmountStrategy.handle(
            eventData,
          );
          break;
        case 'SUBSCRIPTION_CAPPED_AMOUNT_UPDATED':
          await this.subscriptionCappedAmountUpdatedStrategy.handle(eventData);
          break;
        case 'SUBSCRIPTION_CHARGE_ACCEPTED':
          await this.subscriptionChargeAcceptedStrategy.handle(eventData);
          break;
        case 'SUBSCRIPTION_CHARGE_ACTIVATED':
          await this.subscriptionChargeActivatedStrategy.handle(eventData);
          break;
        case 'SUBSCRIPTION_CHARGE_CANCELED':
          await this.subscriptionChargeCanceledStrategy.handle(eventData);
          break;
        case 'SUBSCRIPTION_CHARGE_DECLINED':
          await this.subscriptionChargeDeclinedStrategy.handle(eventData);
          break;
        case 'SUBSCRIPTION_CHARGE_EXPIRED':
          await this.subscriptionChargeExpiredStrategy.handle(eventData);
          break;
        case 'SUBSCRIPTION_CHARGE_FROZEN':
          await this.subscriptionChargeFrozenStrategy.handle(eventData);
          break;
        case 'SUBSCRIPTION_CHARGE_UNFROZEN':
          await this.subscriptionChargeUnfrozenStrategy.handle(eventData);
          break;
        default:
          console.error(`Unknown subscription event type: ${eventType}`);
      }
    });
  }
}