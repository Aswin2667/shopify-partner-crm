import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserEventsProcessor } from './userEvents/user.event.processer';
import {MailModule} from '@org/utils'
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6378, 
      },
    }),
    BullModule.registerQueue({
      name: 'events', 
    }),
    MailModule
  ],
  providers: [UserEventsProcessor],
})
export class AppModule {}