import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { PrismaService } from 'src/config/prisma.service';
import { IntegrationManager } from '@org/integrations';
import { IntegrationModule as PackageIntegrationModule } from '@org/integrations';
import { BullModule } from '@nestjs/bull';
import { GmailEventsProcessor } from './listeners/gmail.listener';
import { ShopifyEventsProcessor } from './listeners/shopify.listner';

@Module({
  imports: [
    PackageIntegrationModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6378,
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
    GmailEventsProcessor,
    ShopifyEventsProcessor,
  ],
  controllers: [IntegrationController],
})
export class IntegrationModule {}
