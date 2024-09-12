import { Injectable } from '@nestjs/common';

@Injectable()
export class RelationshipReactivatedStrategy {
  async handle(data: any) {
    console.log('Handling Relationship Reactivated Event:', data);
    // Add your business logic here
  }
}
