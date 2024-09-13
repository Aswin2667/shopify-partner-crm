import { Injectable } from '@nestjs/common';

@Injectable()
export class RelationshipDeactivatedStrategy {
  async handle(data: any) {
    console.log('Handling Relationship Deactivated Event:', data);
    // Add your business logic here
  }
}
