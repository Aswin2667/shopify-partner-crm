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

  // Get a specific queue by name
  getQueue(queueName: string) {
    return this.queues.get(queueName);
  }

  // Initialize multiple queues
  initializeQueues(queueNames: string[]) {
    queueNames.forEach((queueName) => this.createQueue(queueName));
  }

  async addJobWithRetry(
    queueName: string,
    jobName: string,
    data: any,
    retryOptions: any,
  ) {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    await queue.add(jobName, data, {
      attempts: retryOptions.attempts || 5,
      backoff: {
        type: retryOptions.backoffType || 'exponential',
        delay: retryOptions.backoffDelay || 5000,
      },
      removeOnComplete: retryOptions.removeOnComplete || true,
      removeOnFail: retryOptions.removeOnFail || true,
    });
  }
}