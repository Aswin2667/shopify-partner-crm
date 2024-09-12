import { Injectable } from '@nestjs/common';
import { ShopifyIntegration } from './shopify-integration.interface';
import { BaseIntegrationService } from 'src/base/base-integration.service';
import {
  INTEGRATION_SINGULARITY,
  IntegrationCategory,
  IntegrationData,
  IntegrationSharingType,
  IntegrationType,
} from 'src/types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bull';
import { Prisma, PrismaService } from '@org/data-source';
import { validateIntegration } from 'src/validation';
import { DateHelper } from '@org/utils';

@Injectable()
export class ShopifyIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'Shopify',
    description:
      'Boost your e-commerce game with our Shopify integration. Sync orders, track customers, and manage your store effortlessly within our CRM.',
    type: IntegrationType.SHOPIFY,
    category: IntegrationCategory.ECOMMERCE,
    singular: INTEGRATION_SINGULARITY.SHOPIFY,
    sharedType: IntegrationSharingType.PUBLIC,
    logo: 'https://cdn3.iconfinder.com/data/icons/social-media-2068/64/_shopping-512.png',
    authType: 'CREDENTIALS',
  };

  constructor(
    @InjectQueue('shopify_integration_events')
    private readonly integrationQueue: Queue,
    private readonly prisma: PrismaService,
  ) {
    super();
  }
  async connect(config: any): Promise<any> {
    try {
      const data = {
        ...config,
        isSingular: INTEGRATION_SINGULARITY.SHOPIFY,
        category: IntegrationCategory.ECOMMERCE,
        sharedType: IntegrationSharingType.PUBLIC,
      };

      const isShopifyIntegartionExists =
        await this.prisma.integration.findFirst({
          where: {
            type: data.type,
            isSingular: data.isSingular,
            organizationId: data.organizationId,
          },
        });

      if (isShopifyIntegartionExists) {
        throw new Error('Shopify Integration already exits in Database');
      }

      const validationResult = validateIntegration(data.type, {
        /* Integration Object */
      });
      console.log(validationResult);
      const shopifyIntergration = await this.prisma.integration.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          isSingular: data.isSingular,
          category: data.category,
          organizationId: data.organizationId,
          sharedType: data.sharedType,
          data: {
            partnerId: data.data.partnerId,
            accessToken: data.data.accessToken,
          } as unknown as Prisma.JsonValue,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: DateHelper.getCurrentUnixTime(),
          deletedAt: BigInt(0), // Assuming 0 means not deleted
        },
      });
      console.log(
        'shopifyIntergration created successfully : ' + shopifyIntergration,
      );
      return shopifyIntergration;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  performAction(action: string, params: object): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getIntegrationData(): IntegrationData {
    return this.data;
  }

  manageStore(integration: ShopifyIntegration) {
    // Logic to manage Shopify store
  }
}
