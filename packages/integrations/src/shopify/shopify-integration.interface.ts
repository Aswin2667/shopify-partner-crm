import { BaseIntegration } from '../base/base-integration.interface';

export interface ShopifyIntegration extends BaseIntegration {
  data: {
    apiKey: string;
    apiSecret: string;
    shopUrl: string;
  };
}
