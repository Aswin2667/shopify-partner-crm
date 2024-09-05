import { BaseIntegration } from '../base/base-integration.interface';

export interface SendGridIntegration extends BaseIntegration {
  data: {
    apiKey: string;
  };
}
