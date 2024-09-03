import { Injectable } from '@nestjs/common';
import { SendGridIntegration } from './sendgrid-integration.interface';
import { BaseIntegrationService } from 'src/base/base-integration.service';
import { IntegrationData, IntegrationType } from 'src/types';

@Injectable()
export class SendGridIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'SendGrid',
    description: 'SendGrid integration',
    type: IntegrationType.SEND_GRID,
    logo: 'https://www.gstatic.com/images/branding/product/1x/sendgrid_512dp.png',
    singular: false,
    authType: 'CREDENTIALS',
  };

  constructor() {
    super();
  }
  connect(config: object): Promise<void> {
    throw new Error('Method not implemented.');
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
