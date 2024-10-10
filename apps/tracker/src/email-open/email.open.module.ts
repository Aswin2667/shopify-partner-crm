import { Module } from '@nestjs/common';
import { EmailOpenController } from './email.open.controller';
import { EmailOpenService } from './email.open.service';
import { BullModule } from '@nestjs/bull';
 
@Module({
  imports:[
    BullModule.forRoot({
      redis: {
        host: 'redis-10294.c261.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10294,
        
      },
    }),
    BullModule.registerQueue({
      name: 'email-tracking-queue',
    }),
  ],
  controllers: [EmailOpenController],
  providers: [EmailOpenService],
})
export class EmailOpenModule {}
