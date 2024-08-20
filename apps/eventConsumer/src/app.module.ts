import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserEventsProcessor } from './userEvents/user.event.processer';
 import {MailModule} from '@org/utils'
import { AppInstallsUninstallsEventsProcessor } from './appEvents/install_uninstall_events';
import { PrismaService } from './prisma.service';
import { CreditEventsProcessor } from './appEvents/credit_events';
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
        name: 'install_uninstall_events',
      },
      {
        name: 'credit_events',
      }
  ),
    MailModule
  ],
  providers: [UserEventsProcessor, AppInstallsUninstallsEventsProcessor, CreditEventsProcessor, PrismaService],
})
export class AppModule {}
