export enum IntegrationType {
  SHOPIFY = 'SHOPIFY',
  GMAIL = 'GMAIL',
  MAIL_GUN = 'MAIL_GUN',
  SEND_GRID = 'SEND_GRID',
}

export const INTEGRATION_SINGULARITY = {
  GMAIL: false, // Gmail integrations are not singular (multiple per organization)
  SHOPIFY: true, // Shopify integration is singular (one per organization)
  SEND_GRID: false, // SendGrid integration is not singular (multiple per organization)
  MAIL_GUN: false, // Mailgun integration is not singular (multiple per organization)
};

export type IntegrationData = {
  name: string;
  description: string;
  type: IntegrationType;
  logo: string;
  singular: boolean;
  authType: 'OAUTH2' | 'CREDENTIALS';
};
