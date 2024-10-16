import { Module } from '@nestjs/common';
import { LeadActivityService } from './lead-activity.service';
import { LeadActivityController } from './lead-activity.controller';
import { PrismaService } from '@org/data-source';

@Module({
  controllers: [LeadActivityController],
  providers: [LeadActivityService, PrismaService],
})
export class LeadActivityModule {}
