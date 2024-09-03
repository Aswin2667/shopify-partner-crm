import { z } from 'zod';
import { BaseIntegrationSchema } from '../base/base-integration.schema';

export const GmailIntegrationSchema = BaseIntegrationSchema.extend({
  data: z.object({
    clientId: z.string().min(1, 'Client ID is required'),
    clientSecret: z.string().min(1, 'Client Secret is required'),
    refreshToken: z.string().min(1, 'Refresh Token is required'),
  }),
});
