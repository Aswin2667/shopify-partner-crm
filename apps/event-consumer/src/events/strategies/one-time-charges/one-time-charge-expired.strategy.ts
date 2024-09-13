import { Injectable } from '@nestjs/common';

@Injectable()
export class OneTimeChargeExpiredStrategy {
  async handle(data: any) {
    console.log('Handling One Time Charge Expired Event:', data);
    // Add your business logic here
  }
}
