import { BaseIntegration } from '../base/base-integration.interface';

export interface MailgunIntegration extends BaseIntegration {
  data: {
    apiKey: string;
    domain: string;
  };
}
