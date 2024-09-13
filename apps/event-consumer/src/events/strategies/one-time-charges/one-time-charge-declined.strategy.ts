import { Injectable } from '@nestjs/common';

@Injectable()
export class OneTimeChargeDeclinedStrategy {
  async handle(data: any) {
    console.log('Handling One Time Charge Declined Event:', data);
    // Add your business logic here
  }
}
