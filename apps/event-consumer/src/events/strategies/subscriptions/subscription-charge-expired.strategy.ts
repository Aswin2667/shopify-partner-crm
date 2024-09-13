import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionChargeExpiredStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Charge Expired Event:', data);
    // Add your business logic here
  }
}
