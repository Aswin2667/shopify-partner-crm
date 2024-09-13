import { EventDto } from 'src/events/dto/event.dto';
import { EventPublisher } from '../../../common/interfaces/event.interface';
import { Injectable, Logger } from '@nestjs/common';
import { BullMQClient } from 'src/bullMqClient/bullMq.service'; // Adjust the path as needed
import { ValidationException } from '../../../common/exceptions/validation.exception';
import { InternalServerException } from '../../../common/exceptions/internal-server.exception';
import { ValidationError } from 'class-validator';

@Injectable()
export class RelationshipEventPublisher implements EventPublisher {
  private readonly logger = new Logger(RelationshipEventPublisher.name);

  constructor(private readonly bullMQClient: BullMQClient) {}

  async publish(eventPayload: EventDto): Promise<void> {
    try {
      this.logger.log(
        `Publishing relationship event: ${JSON.stringify(eventPayload)}`,
      );

      const { eventType } = eventPayload;

      const queue = this.bullMQClient.getQueue('relationship-events');
      await queue.add(eventType, eventPayload);
    } catch (error: any) {
      this.logger.error(
        `Failed to publish relationship event: ${error.message}`,
        error.stack,
      );

      if (error instanceof ValidationError) {
        throw new ValidationException('Validation failed: ' + error);
      } else {
        throw new InternalServerException(
          'An unexpected error occurred: ' + error.message,
        );
      }
    }
  }
}