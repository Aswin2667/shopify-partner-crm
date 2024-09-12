import { Injectable } from '@nestjs/common';
import { Job, Processor, Queue, Worker } from 'bullmq';

@Injectable()
export class RedisService {
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly userName: string,
    private readonly password: string,
  ) {
    this.host = host;
    this.port = port;
    this.userName = userName;
    this.password = password;
  }

  public getBullQueueInstance(queueName: string): Queue {
    return new Queue(queueName, {
      connection: {
        host: this.host,
        port: this.port,
        username: this.userName,
        password: this.password,
        connectTimeout: 10000,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        priority: 1,
      },
    });
  }

  public getBullWorkerInstance(queueName: string, callback: Processor): Worker {
    return new Worker(
      queueName,
      async (job) => {
        try {
          await callback(job);
        } catch (error) {
          console.error('Error processing job:', error);
          throw error;
        }
      },
      {
        connection: {
          host: this.host,
          port: this.port,
          username: this.userName,
          password: this.password,
          connectTimeout: 10000,
        },
      },
    );
  }
}
