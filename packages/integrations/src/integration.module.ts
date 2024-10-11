import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntegrationManager } from './integration.manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { GmailIntegrationService } from './gmail/gmail-integration.service';
import { ShopifyIntegrationService } from './shopify/shopify-integration.service';
import { MailgunIntegrationService } from './mailgun/mailgun-integration.service';
import { SendGridIntegrationService } from './sendgrid/sendgrid-integration.service';
import { DataSourceModule, PrismaService } from '@org/data-source';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../../', '.env'),
    }),
    EventEmitterModule.forRoot(),
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
