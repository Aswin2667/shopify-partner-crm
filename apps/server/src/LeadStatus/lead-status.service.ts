import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateLeadStatusDto,
  UpdateLeadStatusDto,
} from './dto/lead-status.dto';
import { PrismaService } from 'src/config/prisma.service';
import { DateHelper } from '@org/utils';

@Injectable()
export class LeadStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLeadStatusDto: CreateLeadStatusDto) {
    try {
      console.log(createLeadStatusDto);
      const newStatus = await this.prisma.leadStatus.create({
        data: {
          status: createLeadStatusDto.status,
          createdAt: DateHelper.getCurrentUnixTime(),
          organizationId: createLeadStatusDto.organizationId,
          updatedAt: 0,
          deletedAt: 0,
        },
      });
      return {
        message: 'LeadStatus created successfully',
        data: newStatus,
        status: true,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create LeadStatus');
    }
  }

  async findAllByOrgId(orgId: string) {
    try {
      const data = await this.prisma.leadStatus.findMany({
        where: {
          organizationId: orgId,
        },
      });
      return {
        message: 'LeadStatus retrieved successfully',
        data: data,
        status: true,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch LeadStatus');
    }
  }

  async findOne(id: string) {
    const leadStatus = await this.prisma.leadStatus.findUnique({
      where: { id },
    });
    if (!leadStatus) {
      throw new NotFoundException(`LeadStatus with ID ${id} not found`);
    }
    return leadStatus;
  }

  async update(id: string, updateLeadStatusDto: UpdateLeadStatusDto) {
    const leadStatus = await this.findOne(id);
    try {
      return await this.prisma.leadStatus.update({
        where: { id },
        data: {
          status: updateLeadStatusDto.status,
          updatedAt: DateHelper.getCurrentUnixTime(),
          Lead: {
            connect: updateLeadStatusDto.leadIds?.map((id) => ({ id })),
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update LeadStatus');
    }
  }

  async remove(id: string) {
    const leadStatus = await this.findOne(id);
    try {
      if (leadStatus) {
        await this.prisma.leadStatus.delete({ where: { id } });
      }
      return { message: 'LeadStatus deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete LeadStatus');
    }
  }
}
