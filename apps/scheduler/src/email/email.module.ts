import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailCronService } from './email.service';
import { DataSourceModule, PrismaService } from '@org/data-source';
import { IntegrationManager,IntegrationModule} from '@org/integrations';
@Module({
  imports: [ScheduleModule.forRoot(), DataSourceModule,IntegrationModule],
  providers: [EmailCronService, PrismaService,IntegrationManager],
})
export class EmailCronModule {}
