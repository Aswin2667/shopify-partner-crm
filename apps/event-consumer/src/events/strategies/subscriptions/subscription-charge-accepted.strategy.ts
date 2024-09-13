import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionChargeAcceptedStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Charge Accepted Event:', data);
    // Add your business logic here
  }
}
