import { z } from 'zod';
import { BaseIntegrationSchema } from '../base/base-integration.schema';

export const ShopifyIntegrationSchema = BaseIntegrationSchema.extend({
  data: z.object({
    apiKey: z.string().min(1, 'API Key is required'),
    apiSecret: z.string().min(1, 'API Secret is required'),
    shopUrl: z.string().url('Invalid shop URL'),
  }),
});
