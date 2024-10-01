import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { LeadStatusService } from 'src/LeadStatus/lead-status.service';
import { PrismaService } from '@org/data-source';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, LeadStatusService, PrismaService],
})
export class OrganizationModule {}
