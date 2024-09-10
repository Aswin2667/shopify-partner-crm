import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserEventsProcessor } from './userEvents/user.event.processer';
import { MailModule } from '@org/utils';
import { AppInstallsUninstallsEventsProcessor } from './appEvents/install_uninstall_events';
import { CreditEventsProcessor } from './appEvents/credit_events';
import { AnalyticsTrackModule } from './controllers/analyticsTrack/analytics.track.module';
import { EmailOpenTrackingProcessor } from './emailTrackingEvents/email.open.processor';
import { DataSourceModule, PrismaService } from '@org/data-source';
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
      },
      {
        name: 'email-tracking-queue',
      },
    ),
    MailModule,
    AnalyticsTrackModule,
    DataSourceModule,
  ],
  providers: [
    UserEventsProcessor,
    AppInstallsUninstallsEventsProcessor,
    CreditEventsProcessor,
    PrismaService,
    EmailOpenTrackingProcessor
  ],
  controllers: [],
})
export class AppModule {}
