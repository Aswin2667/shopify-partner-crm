import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { LeadStatusService } from 'src/LeadStatus/lead-status.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService,LeadStatusService],
})
export class OrganizationModule {}
