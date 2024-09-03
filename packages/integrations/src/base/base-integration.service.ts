import { IntegrationData } from 'src/types';

export abstract class BaseIntegrationService<T> {
  private integrationData: T | null = null;
  abstract connect(config: T): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract performAction(action: string, params: T): Promise<any>;
  abstract getIntegrationData(): IntegrationData;
}
