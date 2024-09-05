import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserEventsProcessor } from './userEvents/user.event.processer';
 import {MailModule} from '@org/utils'
import { AppInstallsUninstallsEventsProcessor } from './appEvents/install_uninstall_events';
import { PrismaService } from './prisma.service';
import { CreditEventsProcessor } from './appEvents/credit_events';
import { AnalyticsTrackModule } from './controllers/analyticsTrack/analytics.track.module';
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
    MailModule,
    AnalyticsTrackModule
  ],
  providers: [UserEventsProcessor, AppInstallsUninstallsEventsProcessor, CreditEventsProcessor, PrismaService],
  controllers:[
  ]
})
export class AppModule {}
