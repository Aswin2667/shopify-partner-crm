import {
  Body,
  Controller,
  Post,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { ValidationError } from 'class-validator';
import { EventPublisherService } from 'src/events/services/event-publisher';
import { EventDto } from '../dto/event.dto';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventPublisherService: EventPublisherService) {}

  @Post('relationship')
  async handleRelationshipEvent(@Body() eventPayload: EventDto) {
    console.log(eventPayload);
    return this.handleEvent(eventPayload, 'relationship-events');
  } 

  @Post('credit')
  async handleCreditEvent(@Body() eventPayload: EventDto) {
    return this.handleEvent(eventPayload, 'credit-events');
  }

  @Post('one-time-charge')
  async handleOneTimeChargeEvent(@Body() eventPayload: EventDto) {
    return this.handleEvent(eventPayload, 'one-time-charge-events');
  }

  @Post('subscription')
  async handleSubscriptionEvent(@Body() eventPayload:any) {
    console.log(eventPayload)
    return this.handleEvent(eventPayload, 'subscription-events');
  }

  private async handleEvent(eventPayload: EventDto, eventType: string) {
    try {
      await this.eventPublisherService.publishEvent(eventPayload, eventType);
      return {
        status: 'success',
        message: `Event ${eventType} has been published`,
      };
    } catch (error) {
      this.logger.error(
        `Failed to handle event for ${eventType}: ${error.message}`,
        error.stack,
      );

      if (error instanceof ValidationError) {
        throw new BadRequestException('Validation failed: ' + error);
      } else {
        throw new InternalServerErrorException(
          'An unexpected error occurred: ' + error.message,
        );
      }
    }
  }
}