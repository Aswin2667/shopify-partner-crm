import { Injectable } from '@nestjs/common';

@Injectable()
export class OneTimeChargeAcceptedStrategy {
  async handle(data: any) {
    console.log('Handling One Time Charge Accepted Event:', data);
    // Add your business logic here
  }
}
