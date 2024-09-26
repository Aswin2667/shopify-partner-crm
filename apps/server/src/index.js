// import { IntegrationType } from '@org/integrations';

const {
  IntegrationType,
  validateIntegration,
  IntegrationManager,
} = require('@org/integrations');
console.log(IntegrationType.GMAIL);

const im = new IntegrationManager();

// console.log
im.getAllIntegrations().then((res) => console.log(res));

im.connectToIntegration(IntegrationType.SHOPIFY, {
  apiKey: '2112',
  apiSecret: '13',
  shopUrl: 'https://example.com',
});

const re = im.performIntegrationAction(IntegrationType.GMAIL, 'sendEmail', {
  mail: 'hello',
});
// console.log(re);

const result = validateIntegration(IntegrationType.SHOPIFY, {
  organizationId: '1',
  data: { apiKey: '2112', apiSecret: '13', shopUrl: 'https://example.com' },
  createdAt: BigInt(0),
  updatedAt: BigInt(0),
  deletedAt: BigInt(0),
  type: IntegrationType.SHOPIFY,
  name: 'Test',
  isSingular: true,
});

if (result.success) {
  console.log('Validation passed:', result.data);
} else {
  console.error('Validation failed:', result.error.errors);
}
