import { Injectable } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullMQClient {
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();

  constructor(private configService: ConfigService) {}

  createQueue(queueName: string) {
    const queue = new Queue(queueName, {
      connection: {
        host: this.configService.get('REDIS_HOST') || '0.0.0.0',
        port: this.configService.get('REDIS_PORT') || 6378,
      },
    });
    this.queues.set(queueName, queue);
    return queue;
  }

  createWorker(queueName: string, processor: (job) => Promise<void>) {
    const worker = new Worker(queueName, processor, {
      connection: {
        host: this.configService.get('REDIS_HOST') || '0.0.0.0',
        port: this.configService.get('REDIS_PORT') || 6378,
      },
    });
    this.workers.set(queueName, worker);
    return worker;
  }
}