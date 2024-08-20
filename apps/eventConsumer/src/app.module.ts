import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserEventsProcessor } from './userEvents/user.event.processer';
 import {MailModule} from '@org/utils'
import { AppEventsProcessor } from './appEvents/app.event.processor';
import { PrismaService } from './prisma.service';
 import { MailModule } from '@org/utils';
 @Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6378,
      },
    }),
     BullModule.registerQueue(
      {
      name: 'events', 
      }, 
      {
        name: 'app_events',
      }
  ),
    MailModule
  ],
  providers: [UserEventsProcessor, AppEventsProcessor, PrismaService],
})
export class AppModule {}
