import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionApproachingCappedAmountStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Approaching Capped Amount Event:', data);
    // Add your business logic here
  }
}
