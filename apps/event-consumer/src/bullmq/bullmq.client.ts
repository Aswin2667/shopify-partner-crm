import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
 import { BullMQClient } from './bullmq.module';
 
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: "redis",
        port: parseInt("6379"),
      },
    }),
  ],
  providers: [BullMQClient],
  exports: [BullMQClient],
})
export class BullMQModule {}
