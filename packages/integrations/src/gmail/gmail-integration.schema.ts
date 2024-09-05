import { z } from 'zod';
import { BaseIntegrationSchema } from '../base/base-integration.schema';

export const GmailIntegrationSchema = BaseIntegrationSchema.extend({
  data: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    googleId: z.string().min(1, 'Google ID is required'),
    accessToken: z.string().min(1, 'Access Token is required'),
    refreshToken: z.string().min(1, 'Refresh Token is required'),
  }),
});
