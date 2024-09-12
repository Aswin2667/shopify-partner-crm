import {
  IntegrationCategory,
  IntegrationSharingType,
  IntegrationType,
} from 'src/types';
import { z } from 'zod';

export const BaseIntegrationSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string().min(1, 'Organization ID is required'),
  data: z.any(),
  description: z.string().optional(),
  // type: z.string().refine((val) => val in IntegrationType, 'Invalid type'),
  type: z.nativeEnum(IntegrationType, {
    errorMap: () => ({ message: 'Invalid integration type' }),
  }),
  createdAt: z.number(),
  updatedAt: z.number(),
  deletedAt: z.number(),
  name: z.string().min(1, 'Name is required'),
  isSingular: z.boolean(),
  category: z.nativeEnum(IntegrationCategory, {
    errorMap: () => ({ message: 'Invalid integration category' }),
  }),
  sharedType: z.nativeEnum(IntegrationSharingType, {
    errorMap: () => ({ message: 'Invalid integration sharing type' }),
  }),
});
