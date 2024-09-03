import { Module } from '@nestjs/common';
import { IntegrationManager } from './integration.manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { GmailIntegrationService } from './gmail/gmail-integration.service';
import { ShopifyIntegrationService } from './shopify/shopify-integration.service';
import { MailgunIntegrationService } from './mailgun/mailgun-integration.service';
import { SendGridIntegrationService } from './sendgrid/sendgrid-integration.service';
import { DataSourceModule, PrismaService } from '@org/data-source';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
    DataSourceModule,
  ],
  providers: [
    GmailIntegrationService,
    ShopifyIntegrationService,
    MailgunIntegrationService,
    SendGridIntegrationService,
    IntegrationManager,
    PrismaService,
  ],
  exports: [
    GmailIntegrationService,
    ShopifyIntegrationService,
    MailgunIntegrationService,
    SendGridIntegrationService,
    IntegrationManager,
    PrismaService,
  ],
})
export class IntegrationModule {}