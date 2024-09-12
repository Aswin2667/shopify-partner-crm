import { Injectable } from '@nestjs/common';
import { BaseIntegrationService as IntegrationService } from './base/base-integration.service';
import { IntegrationData, IntegrationType } from './types';
import { ShopifyIntegrationService } from './shopify/shopify-integration.service';
import { GmailIntegrationService } from './gmail/gmail-integration.service';
import { MailgunIntegrationService } from './mailgun/mailgun-integration.service';
import { SendGridIntegrationService } from './sendgrid/sendgrid-integration.service';
import { validateIntegration } from './validation';

@Injectable()
export class IntegrationManager {
  private integrationServices: Map<IntegrationType, IntegrationService<object>>;

  constructor(
    private readonly shopifyIntegrationService: ShopifyIntegrationService,
    private readonly gmailIntegrationService: GmailIntegrationService,
    private readonly mailgunIntegrationService: MailgunIntegrationService,
    private readonly sendGridIntegrationService: SendGridIntegrationService,
  ) {
    this.integrationServices = new Map<
      IntegrationType,
      IntegrationService<object>
    >();

    this.integrationServices.set(
      IntegrationType.SHOPIFY,
      this.shopifyIntegrationService,
    );
    this.integrationServices.set(
      IntegrationType.GMAIL,
      this.gmailIntegrationService,
    );
    this.integrationServices.set(
      IntegrationType.MAIL_GUN,
      this.mailgunIntegrationService,
    );
    this.integrationServices.set(
      IntegrationType.SEND_GRID,
      this.sendGridIntegrationService,
    );
  }

  public async getAllIntegrations(): Promise<IntegrationData[]> {
    const integrations = [];

    for (const service of this.integrationServices.values()) {
      const integrationData = service.getIntegrationData();
      integrations.push(integrationData);
    }

    return integrations;
  }

  public async createIntegration(type: IntegrationType, config: any) {
    const validatedData = validateIntegration(type, config.data);
    // Save the integration to your data store, e.g., database
    return validatedData;
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
