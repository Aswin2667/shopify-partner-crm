import { Injectable } from '@nestjs/common';

@Injectable()
export class CreditFailedStrategy {
  async handle(data: any) {
    console.log('Handling Credit Applied Event:', data);
    // Add your business logic here
  }
}
