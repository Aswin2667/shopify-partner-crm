export class CreateLeadDto {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly appId: string;
  readonly shopifyDomain: string;
  readonly shopifyStoreId: string;
  readonly shopDetails: {
    address: string;
    ownerName: string;
  };
  readonly industry: string;
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly deletedAt?: number = 0;
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
