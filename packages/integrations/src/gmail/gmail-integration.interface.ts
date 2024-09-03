import { BaseIntegration } from '../base/base-integration.interface';

export interface GmailIntegration extends BaseIntegration {
  data: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
}
