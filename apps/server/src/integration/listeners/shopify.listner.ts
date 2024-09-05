import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { DateHelper } from '@org/utils';
import { PrismaService } from 'src/config/prisma.service';
import { Prisma } from '@prisma/client';
import { validateIntegration } from '@org/integrations';

@Processor('shopify_integration_events')
export class ShopifyEventsProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('CONNECT_TO_SHOPIFY')
  async handleConnectToShopify(job: Job) {
    try {
      const { data } = job;
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
      console.log(validationResult)

      const shopifyIntergration = await this.prisma.integration.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          isSingular: data.isSingular,
          organizationId: data.organizationId,
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
      console.log('data: ', data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
