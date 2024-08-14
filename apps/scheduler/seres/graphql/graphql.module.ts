import { Module } from '@nestjs/common';
import { GraphQLService } from './graphql.service';

@Module({
  providers: [GraphQLService],
  exports: [GraphQLService],
})
export class GraphQLModule {}
