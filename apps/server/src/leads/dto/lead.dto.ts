export class CreateLeadDto {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly appId: string;
  readonly myShopifyDomain: string;
  readonly shopifyStoreId: string;
  readonly shopDetails: {
    address: string;
    ownerName: string;
  };
  readonly industry: string;
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly deletedAt?: number = 0;
  userId: any;
  organizationId: any;
  integrationId: any;
  status: any;
}
export class UpdateLeadDto {
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly shopDetails?: {
    address?: string;
    ownerName?: string;
  };
  readonly industry?: string;
  readonly updatedAt?: number;
  readonly deletedAt?: number;
}
