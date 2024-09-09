import { Injectable } from '@nestjs/common';
import { SendGridIntegration } from './sendgrid-integration.interface';
import { BaseIntegrationService } from 'src/base/base-integration.service';
import {
  INTEGRATION_SINGULARITY,
  IntegrationData,
  IntegrationType,
} from 'src/types';
import { Prisma, PrismaService } from '@org/data-source';
import { validateIntegration } from 'src/validation';
import { DateHelper } from '@org/utils';

@Injectable()
export class SendGridIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'SendGrid',
    description:
      'Reach your customers with precision using SendGrid. From transactional emails to marketing campaigns, manage it all directly from our CRM.',
    type: IntegrationType.SEND_GRID,
    logo: 'https://wpforms.com/wp-content/uploads/cache/integrations/4dc59b3dad493b05c625c346465cee83.png',
    singular: false,
    authType: 'CREDENTIALS',
  };

  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async connect(config: any): Promise<any> {
    try {
      const isSendGridIntegartionExists =
        await this.prisma.integration.findFirst({
          where: {
            type: config.type,
            isSingular: INTEGRATION_SINGULARITY[config.type],
            organizationId: config.organizationId,
          },
        });

      if (isSendGridIntegartionExists) {
        throw new Error('SendGrid Integration already exits in Database');
      }

      const validationResult = validateIntegration(config.type, {
        /* Integration Object */
      });
      console.log(validationResult);

      const sendGridIntergration = await this.prisma.integration.create({
        data: {
          name: config.name,
          description: config.description,
          type: config.type,
          isSingular: INTEGRATION_SINGULARITY[config.type],
          organizationId: config.organizationId,
          data: {
            apiKey: config.data.apiKey,
          } as unknown as Prisma.JsonValue,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: DateHelper.getCurrentUnixTime(),
          deletedAt: BigInt(0), // Assuming 0 means not deleted
        },
      });
      console.log(
        'sendGridIntergration created successfully : ' + sendGridIntergration,
      );
      return sendGridIntergration;
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
}
