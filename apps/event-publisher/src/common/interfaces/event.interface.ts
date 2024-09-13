export interface EventPublisher {
    publish(eventPayload: any): Promise<void>;
  }
  