import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { PrismaService } from '@org/data-source';
import { LeadActivityService } from 'src/lead-activity/lead-activity.service';

@Module({
  controllers: [LeadController],
  providers: [LeadService, PrismaService, LeadActivityService],
})
export class LeadModule {}
