import { z } from 'zod';

export const IntegrationDataSchema = z.object({
  accessToken: z.string(),
  partnerId: z.string(),
});

export const CreateIntegrationDto = z.object({
  name: z.string(),
  type: z.enum(['SHOPIFY', 'KLAVIYO', 'ZAPIER']).optional(),
  data: z.any(),  // Handles any JSON data
  organizationId: z.string(),
  description: z.string().optional(),
  createdAt: z.bigint().optional(),
  updatedAt: z.bigint().optional(),
});

export const UpdateIntegrationDto = z.object({
  name: z.string().optional(),
  type: z.enum(['SHOPIFY', 'KLAVIYO', 'ZAPIER']).optional(),
  data: CreateIntegrationDto.partial(),
  description: z.string().optional(),
});

export type CreateIntegrationDto = z.infer<typeof CreateIntegrationDto>;
export type UpdateIntegrationDto = z.infer<typeof UpdateIntegrationDto>;
