import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionChargeActivatedStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Charge Activated Event:', data);
    // Add your business logic here
  }
}
