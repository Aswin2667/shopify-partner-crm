import { Injectable } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationType } from './types';
import { ShopifyIntegrationService } from './services/shopify.helper.service';
import { GmailIntegrationService } from './services/gmail.helper.service';
import { MailgunIntegrationService } from './services/mailgun.helper.service';
import { SendGridIntegrationService } from './services/sendgrid.helper.service';
import { PrismaService } from 'src/config/prisma.service';
import { DateHelper } from '@org/utils';

export const INTEGRATION_SINGULARITY = {
  GMAIL: false, // Gmail integrations are not singular (multiple per organization)
  SHOPIFY: true, // Shopify integration is singular (one per organization)
  // Add other integration singularity here
};

@Injectable()
export class IntegrationManager {
  private integrationServices: Map<IntegrationType, IntegrationService<object>>;

  constructor(private readonly prismaService: PrismaService) {
    this.integrationServices = new Map<
      IntegrationType,
      IntegrationService<object>
    >();
    this.integrationServices.set(
      IntegrationType.SHOPIFY,
      new ShopifyIntegrationService(),
    );
    this.integrationServices.set(
      IntegrationType.GMAIL,
      new GmailIntegrationService(),
    );
    this.integrationServices.set(
      IntegrationType.MAIL_GUN,
      new MailgunIntegrationService(),
    );
    this.integrationServices.set(
      IntegrationType.SEND_GRID,
      new SendGridIntegrationService(),
    );
  }

  public async createIntegration(type: IntegrationType, config: any) {
    const integration = this.prismaService.integration.create({
      data: {
        name: config.name,
        description: config.description,
        data: config.data,
        isSingular: INTEGRATION_SINGULARITY[type || ''] || false,
        type: type,
        organizationId: config.organizationId,
        updatedAt: DateHelper.getCurrentUnixTime(),
        createdAt: DateHelper.getCurrentUnixTime(),
        deletedAt: 0,
      },
    });
    return integration;
  }

  public async getIntegration(integrationId: string) {
    const integration = this.prismaService.integration.findUnique({
      where: {
        id: integrationId,
      },
    });
    return integration;
  }

  public async getIntegrations(organizationId: string) {
    const integrations = this.prismaService.integration.findMany({
      where: {
        organizationId,
      },
    });
    return integrations;
  }

  public async updateIntegration(integrationId: string, config: any) {
    const integration = this.prismaService.integration.update({
      where: {
        id: integrationId,
      },
      data: {
        name: config.name,
        description: config.description,
        data: config.data,
        updatedAt: DateHelper.getCurrentUnixTime(),
      },
    });
    return integration;
  }

  public async deleteIntegration(integrationId: string) {
    const integration = this.prismaService.integration.delete({
      where: {
        id: integrationId,
      },
    });
    return integration;
  }

  public async connectToIntegration(type: IntegrationType, config: object) {
    const service = this.integrationServices.get(type);
    if (service) {
      return await service.connect(config);
    } else {
      throw new Error(`Integration type ${type} is not supported`);
    }
  }

  public async disconnectFromIntegration(type: IntegrationType) {
    const service = this.integrationServices.get(type);
    if (service) {
      return await service.disconnect();
    } else {
      throw new Error(`Integration type ${type} is not supported`);
    }
  }

  public async performIntegrationAction(
    type: IntegrationType,
    action: string,
    params: object,
  ) {
    const service = this.integrationServices.get(type);
    if (service) {
      return await service.performAction(action, params);
    } else {
      throw new Error(`Integration type ${type} is not supported`);
    }
  }
}
