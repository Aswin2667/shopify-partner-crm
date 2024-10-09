import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
// import { PrismaService } from '@org/data-source';
import { PrismaService } from '@org/data-source';

import { IntegrationManager } from '@org/integrations';
import { IntegrationModule as PackageIntegrationModule } from '@org/integrations';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PackageIntegrationModule,
    BullModule.forRoot({
      redis: {
        host: 'redis-10294.c261.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10294,
        
      },
    }),
    BullModule.registerQueue(
      {
        name: 'gmail_integration_events',
      },
      {
        name: 'shopify_integration_events',
      },
    ),
  ],
  providers: [
    IntegrationService,
    PrismaService,
    IntegrationManager,
  ],
  controllers: [IntegrationController],
})
export class IntegrationModule {}
