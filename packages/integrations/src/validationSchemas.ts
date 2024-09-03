import { z } from 'zod';
import { IntegrationType } from './types';

export const ShopifySchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  apiSecret: z.string().min(1, 'API Secret is required'),
  shopUrl: z.string().url('Invalid shop URL'),
});

export const GmailSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  refreshToken: z.string().min(1, 'Refresh Token is required'),
});

export const MailgunSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  domain: z.string().min(1, 'Domain is required'),
});

export const SendGridSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
});

export function validateIntegrationData(type: IntegrationType, data: any) {
  const schemas = {
    [IntegrationType.SHOPIFY]: ShopifySchema,
    [IntegrationType.GMAIL]: GmailSchema,
    [IntegrationType.MAIL_GUN]: MailgunSchema,
    [IntegrationType.SEND_GRID]: SendGridSchema,
  };

  const schema = schemas[type];
  if (!schema) throw new Error(`No schema for integration type: ${type}`);
  return schema.parse(data);
}
