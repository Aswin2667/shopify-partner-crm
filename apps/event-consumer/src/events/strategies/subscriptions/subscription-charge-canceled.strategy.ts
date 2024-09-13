import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionChargeCanceledStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Charge Canceled Event:', data);
    // Add your business logic here
  }
}
