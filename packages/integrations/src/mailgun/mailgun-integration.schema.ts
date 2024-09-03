import { z } from 'zod';
import { BaseIntegrationSchema } from '../base/base-integration.schema';

export const MailgunIntegrationSchema = BaseIntegrationSchema.extend({
  data: z.object({
    apiKey: z.string().min(1, 'API Key is required'),
    domain: z.string().min(1, 'Domain is required'),
  }),
});
