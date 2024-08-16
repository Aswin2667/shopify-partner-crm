import { Module } from '@nestjs/common';
import { AppService } from '../app/app.service';

@Module({
  providers: [AppService],
})
export class SchedulerModule {}
