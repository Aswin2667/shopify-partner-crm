import { Module } from '@nestjs/common';
import { EmailOpenController } from './email.open.controller';
import { EmailOpenService } from './email.open.service';
import { BullModule } from '@nestjs/bull';
 
@Module({
  imports:[
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
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
