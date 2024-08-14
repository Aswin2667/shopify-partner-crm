import { Injectable } from '@nestjs/common';

import { CreateLeadActivityDto } from './dto/lead-activity.dto';
import { PrismaService } from 'src/config/prisma.service';
import { DateHelper } from '@org/utils';

@Injectable()
export class LeadActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLeadActivityDto:any) {
    return this.prisma.leadActivity.create({
      data: {
        type: createLeadActivityDto.type,
        data: createLeadActivityDto.data,
        leadId: createLeadActivityDto.leadId,
        userId: createLeadActivityDto.userId,
        createdAt: DateHelper.getCurrentUnixTime(),
        updatedAt: 0,
        deletedAt: 0,
      },
    });
  }

  async findAllByLeadId() {
    return this.prisma.leadActivity.findMany();
  }


}
