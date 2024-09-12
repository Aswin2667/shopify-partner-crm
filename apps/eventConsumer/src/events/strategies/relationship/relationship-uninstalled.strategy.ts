import { Injectable } from '@nestjs/common';

@Injectable()
export class RelationshipUninstalledStrategy {
  async handle(data: any) {
    console.log('Handling Relationship Uninstalled Event:', data);
    // Add your business logic here
  }
}
