import { Injectable } from '@nestjs/common';
import { MailgunIntegration } from './mailgun-integration.interface';
import { BaseIntegrationService } from 'src/base/base-integration.service';
import { IntegrationData, IntegrationType } from 'src/types';

@Injectable()
export class MailgunIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'Mailgun',
    description: 'Mailgun integration',
    type: IntegrationType.MAIL_GUN,
    logo: 'https://www.gstatic.com/images/branding/product/1x/gmail_512dp.png',
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

  //  private methods for to perform the action
}
