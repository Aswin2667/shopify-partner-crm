import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionChargeUnfrozenStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Charge Unfrozen Event:', data);
    // Add your business logic here
  }
}
