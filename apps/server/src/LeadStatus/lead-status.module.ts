import { Module } from '@nestjs/common';
import { LeadStatusService } from './lead-status.service';
import { LeadStatusController } from './lead-status.controller';
import { PrismaService } from '@org/data-source';

@Module({
  controllers: [LeadStatusController],
  providers: [LeadStatusService, PrismaService],
})
export class LeadStatusModule {}
