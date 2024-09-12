// It defines if the integration is singular or not
export const INTEGRATION_SINGULARITY = {
  // SINGULAR - true
  // NOT SINGULAR - false
  GMAIL: false, // Gmail integrations are not singular (multiple per organization)
  SHOPIFY: true, // Shopify integration is singular (one per organization)
  SEND_GRID: true, // SendGrid integration is not singular (multiple per organization)
  MAIL_GUN: true, // Mailgun integration is not singular (multiple per organization)
};

// It defines the data type of the integrationData
export type IntegrationData = {
  name: string;
  description: string;
  type: IntegrationType;
  logo: string;
  singular: boolean;
  authType: 'OAUTH2' | 'CREDENTIALS';
  category: IntegrationCategory;
  sharedType: IntegrationSharingType;
};

// It defines the type of the integration
export enum IntegrationType {
  SHOPIFY = 'SHOPIFY',
  GMAIL = 'GMAIL',
  MAIL_GUN = 'MAIL_GUN',
  SEND_GRID = 'SEND_GRID',
}

// It defines that the integration falls under which category
export enum IntegrationCategory {
  ECOMMERCE = 'ECOMMERCE',
  MAIL_SERVICE = 'MAIL_SERVICE',
  OTHER = 'OTHER',
}

// It defines whether the integration is public or private for the organization , if public means only for the particular user
export enum IntegrationSharingType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
