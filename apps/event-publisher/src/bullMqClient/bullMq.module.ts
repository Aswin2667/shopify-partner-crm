import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullMQClient } from './bullMq.service';

@Module({
  imports: [ConfigModule],
  providers: [BullMQClient],
  exports: [BullMQClient],
})
export class BullMQModule implements OnModuleInit {
  constructor(private readonly bullMQClient: BullMQClient) {}

  onModuleInit() {
    const queues = ['relationship-events', 'credit-events','one-time-charge-events','subscription-events'];
    this.bullMQClient.initializeQueues(queues);

    // this.bullMQClient.createWorker('relationship-events', async (job) => {
    //   console.log(`Processing job ${JSON.stringify(job)} in relationship-events queue`);
    // });
  }
}