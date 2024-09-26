import { z } from 'zod';
import { BaseIntegrationSchema } from '../base/base-integration.schema';

export const ShopifyIntegrationSchema = BaseIntegrationSchema.extend({
  data: z.object({
    partnerId: z.string().min(1, 'Partner ID is required'),
    accessToken: z.string().min(1, 'Access Token is required'),
  }),
});
