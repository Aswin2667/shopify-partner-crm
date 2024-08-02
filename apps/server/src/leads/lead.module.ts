import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';

@Module({
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
