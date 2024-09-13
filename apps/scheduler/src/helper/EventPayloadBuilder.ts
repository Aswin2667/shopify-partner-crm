import { v4 as uuidv4 } from 'uuid';

interface EventPayload {
    eventId: string;
    id: string;
    timestamp?: string;  
  }
  
  interface Actor {
    id: string;
    type: string;
  }
  
  interface Metadata {
    eventSource: string;
    version: string;
    priority: string;
  }
  
  interface BuildEventOptions {
    eventPayload: EventPayload;
    eventType: string;
    eventSource: string;
    actor: Actor;
    metadata?: Metadata;
  }
  
  function buildEventData({
    eventPayload,
    eventType,
    eventSource,
    actor,
    metadata = {
      eventSource: 'user-service',
      version: '1.0',
      priority: 'high',
    },
  }: BuildEventOptions) {
    return {
      eventType: eventType,
      eventId: eventPayload.eventId || uuidv4(), // Use UUID if no eventId is provided
      timestamp: eventPayload.timestamp || new Date().toISOString(),  
      eventSource: eventSource,
      actor: {
        id: actor.id,
        type: actor.type, 
      },
      payload: eventPayload,
      metadata: {
        eventSource: metadata.eventSource ,
        version: metadata.version ,
        priority: metadata.priority,
      },
    };
  }
  