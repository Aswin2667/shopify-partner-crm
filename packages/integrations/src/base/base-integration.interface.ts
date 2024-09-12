import { JsonValue } from '@org/data-source/generated/runtime/library';
import {
  IntegrationCategory,
  IntegrationSharingType,
  IntegrationType,
} from 'src/types';

export interface BaseIntegration {
  id?: string;
  organizationId: string;
  data: JsonValue;
  description?: string;
  type: IntegrationType;
  createdAt: bigint;
  updatedAt: bigint;
  deletedAt: bigint;
  name: string;
  isSingular: boolean;
  category: IntegrationCategory;
  sharedType: IntegrationSharingType;
}
