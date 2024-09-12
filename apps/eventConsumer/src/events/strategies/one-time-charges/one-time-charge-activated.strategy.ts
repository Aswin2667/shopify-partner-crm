import { Injectable } from '@nestjs/common';

@Injectable()
export class OneTimeChargeActivatedStrategy {
  async handle(data: any) {
    console.log('Handling One Time Charge Activated Event:', data);
    // Add your business logic here
  }
}
