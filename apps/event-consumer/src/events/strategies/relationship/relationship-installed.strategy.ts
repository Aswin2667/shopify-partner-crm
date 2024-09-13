import { Injectable } from '@nestjs/common';

@Injectable()
export class RelationshipInstalledStrategy {
  async handle(data: any) {
    console.log('Handling Relationship Installed Event:', data);
  }
}