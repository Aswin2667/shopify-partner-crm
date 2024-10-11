import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
 import { BullMQClient } from './bullmq.module';
 
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: "redis-10294.c261.us-east-1-4.ec2.redns.redis-cloud.com",
        port: parseInt("10294")
      },
    }),
  ],
  providers: [BullMQClient],
  exports: [BullMQClient],
})
export class BullMQModule {}
