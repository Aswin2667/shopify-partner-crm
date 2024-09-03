import { z } from 'zod';
import { BaseIntegrationSchema } from '../base/base-integration.schema';

export const SendGridIntegrationSchema = BaseIntegrationSchema.extend({
  data: z.object({
    apiKey: z.string().min(1, 'API Key is required'),
  }),
});
