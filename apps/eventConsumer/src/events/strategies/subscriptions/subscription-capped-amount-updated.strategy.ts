import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionCappedAmountUpdatedStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Capped Amount Updated Event:', data);
    // Add your business logic here
  }
}
