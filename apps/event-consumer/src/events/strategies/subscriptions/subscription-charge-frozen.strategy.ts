import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionChargeFrozenStrategy {
  async handle(data: any) {
    console.log('Handling Subscription Charge Frozen Event:', data);
    // Add your business logic here
  }
}
