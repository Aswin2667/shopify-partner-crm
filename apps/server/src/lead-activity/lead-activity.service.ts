import { Injectable } from '@nestjs/common';

import { CreateLeadActivityDto } from './dto/lead-activity.dto';

import { DateHelper } from '@org/utils';
import { PrismaService } from '@org/data-source';
@Injectable()
export class LeadActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLeadActivityDto: any) {
    console.log(JSON.stringify(createLeadActivityDto));
    try {
      const activity = await this.prisma.leadActivity.create({
        data: {
          type: createLeadActivityDto.type,
          data: createLeadActivityDto.data,
          leadId: createLeadActivityDto.leadId,
          userId: createLeadActivityDto.userId,
          orgId: createLeadActivityDto.organizationId,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: 0,
          deletedAt: 0,
        },
      });
      return activity;
    } catch (error) {
      console.log(error);
    }
  }

  async findAllByLeadId(leadId: string) {
    try {
      const data = await this.prisma.leadActivity.findMany({
        where: {
          leadId: leadId,
        },
        include: {
          user: true,
          note: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        status: true,
        message: 'Activities fetched successfully.',
        data,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
