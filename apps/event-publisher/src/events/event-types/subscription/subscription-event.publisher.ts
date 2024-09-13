import { EventDto } from 'src/events/dto/event.dto';
import { EventPublisher } from '../../../common/interfaces/event.interface';
import { Injectable, Logger } from '@nestjs/common';
import { BullMQClient } from 'src/bullMqClient/bullMq.service'; // Adjust the path as needed
import { ValidationException } from '../../../common/exceptions/validation.exception';
import { InternalServerException } from '../../../common/exceptions/internal-server.exception';
import { ValidationError } from 'class-validator';

@Injectable()
export class SubscriptionEventPublisher implements EventPublisher {
  private readonly logger = new Logger(SubscriptionEventPublisher.name);

  constructor(private readonly bullMQClient: BullMQClient) {}

  async publish(eventPayload: EventDto): Promise<void> {
    try {
      // Log the publishing attempt
      this.logger.log(`Publishing subscription event: ${JSON.stringify(eventPayload)}`);

      // Extract relevant data
      const { eventType } = eventPayload;

      // Add the job to the 'subscription-events' queue
      const queue = this.bullMQClient.getQueue('subscription-events');
      await queue.add(eventType, eventPayload);
    } catch (error: any) {
      this.logger.error(`Failed to publish subscription event: ${error.message}`, error.stack);

      if (error instanceof ValidationError) {
        // Handle validation errors specifically
        throw new ValidationException('Validation failed: ' + error);
      } else {
        // Handle other types of errors
        throw new InternalServerException('An unexpected error occurred: ' + error.message);
      }
    }
  }
}
