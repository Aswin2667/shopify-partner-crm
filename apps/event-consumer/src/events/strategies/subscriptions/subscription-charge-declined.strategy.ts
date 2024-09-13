import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionChargeDeclinedStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Charge Declined Event:', data);
    // Add your business logic here
  }
}
