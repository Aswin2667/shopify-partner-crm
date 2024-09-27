import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { PrismaService } from 'src/config/prisma.service';
import { LeadActivityService } from 'src/lead-activity/lead-activity.service';
import { LeadQueryBuilder } from 'src/queryBuilders/LeadQueryBuilder';

@Module({
  controllers: [LeadController],
  providers: [LeadService, PrismaService, LeadActivityService,LeadQueryBuilder],
})
export class LeadModule {}
