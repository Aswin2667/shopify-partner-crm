import { Injectable } from '@nestjs/common';
import { MailgunIntegration } from './mailgun-integration.interface';
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
export class MailgunIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'Mailgun',
    description: 'Mailgun integration',
    type: IntegrationType.MAIL_GUN,
    logo: 'https://seeklogo.com/images/M/mailgun-logo-5388F66106-seeklogo.com.png',
    singular: false,
    authType: 'CREDENTIALS',
  };
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async connect(config: any): Promise<any> {
    try {
      const isMailGunIntegartionExists =
        await this.prisma.integration.findFirst({
          where: {
            type: config.type,
            isSingular: INTEGRATION_SINGULARITY[config.type],
            organizationId: config.organizationId,
          },
        });

      if (isMailGunIntegartionExists) {
        throw new Error('MailGun Integration already exits in Database');
      }

      const validationResult = validateIntegration(config.type, {
        /* Integration Object */
      });
      console.log(validationResult);

      const mailGunIntergration = await this.prisma.integration.create({
        data: {
          name: config.name,
          description: config.description,
          type: config.type,
          isSingular: INTEGRATION_SINGULARITY[config.type],
          organizationId: config.organizationId,
          data: {
            apiKey: config.data.apiKey,
            domain: config.data.domain,
          } as unknown as Prisma.JsonValue,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: DateHelper.getCurrentUnixTime(),
          deletedAt: BigInt(0), // Assuming 0 means not deleted
        },
      });
      console.log(
        'mailGunIntergration created successfully : ' + mailGunIntergration,
      );
      return mailGunIntergration;
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

  //  private methods for to perform the action
}
