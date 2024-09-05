import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventPublisherService {
  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent(eventName: string, payload: any): void {
    this.eventEmitter.emit(eventName, payload);
    console.log(`Event emitted: ${eventName}`, payload);
  }
}