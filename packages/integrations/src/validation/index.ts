import { z } from 'zod';
import { IntegrationType } from '../types';
import { ShopifyIntegrationSchema as ShopifySchema } from '../shopify/shopify-integration.schema';
import { GmailIntegrationSchema as GmailSchema } from '../gmail/gmail-integration.schema';
import { MailgunIntegrationSchema as MailgunSchema } from '../mailgun/mailgun-integration.schema';
import { SendGridIntegrationSchema as SendGridSchema } from '../sendgrid/sendgrid-integration.schema';

const schemas = {
  [IntegrationType.SHOPIFY]: ShopifySchema,
  [IntegrationType.GMAIL]: GmailSchema,
  [IntegrationType.MAIL_GUN]: MailgunSchema,
  [IntegrationType.SEND_GRID]: SendGridSchema,
};

export function validateIntegration(type: IntegrationType, data: any) {
  const schema = schemas[type];
  console.log(data);
  if (!schema) {
    throw new Error(`No schema defined for integration type: ${type}`);
  }
  return schema.safeParse(data);
}
