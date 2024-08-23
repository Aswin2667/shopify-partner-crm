import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { PrismaService } from 'src/config/prisma.service';
import { DateHelper } from '@org/utils';
import { randomUUID } from 'crypto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LeadActivityService } from 'src/lead-activity/lead-activity.service';

@Injectable()
export class LeadService {
  private leads = [];
  constructor(
    private readonly prismaService: PrismaService,
    private readonly LeadActivityService: LeadActivityService,
  ) {}
  async findAllByIntegrationId(appId: string) {
   try {
      return await this.prismaService.lead.findMany({
        where: {
          integrationId: appId,
        },orderBy:{
        createdAt: 'desc'
         }
      }) 
   } catch (error) {
    
   }
  }

  async findOne(leadId: string) {
    try {
      const lead = await this.prismaService.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      if (!lead) {
        return null;
      }
      return lead
    } catch (error) {
       console.error('Error finding lead:', error);
  
      return {
        status: false,
        message: 'An error occurred while retrieving the lead',
        data: null,
      };
    }
  }
  

  async create(createLeadDto: CreateLeadDto) {
    try {
      console.log("----------------------------------"+createLeadDto)
      const lead = await this.prismaService.lead.create({
        data: {
          shopifyDomain: createLeadDto.myShopifyDomain,
          shopifyStoreId: randomUUID(),
          createdAt: DateHelper.getCurrentUnixTime(),
          leadSource:"Manually added",
          updatedAt: 0,
          deletedAt: 0,
          organizationId: createLeadDto.organizationId,
          integrationId: createLeadDto.integrationId,
        },
      });

      // await this.prismaService.leadProject.create({
      //   data: {
      //     leadId: lead.id,
      //     projectId: createLeadDto.projectId,
      //     createdAt: DateHelper.getCurrentUnixTime(),
      //     updatedAt:0,
      //     deletedAt:0,
      // }})
      console.log(createLeadDto)
      const activity = {
        type: 'LEAD_CREATED',
        data: { message: 'User manually created by' },
        leadId: lead.id,
        userId: createLeadDto.userId,
      };
      await this.LeadActivityService.create(activity);
      return lead;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Shopify domain or store ID already exists.',
          );
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the lead.',
      );
    }
  }

  async update(leadId: string, updateLeadDto: UpdateLeadDto) {
    const index = this.leads.findIndex((lead) => lead.id === leadId);
    if (index === -1) {
      return null;
    }
    const updatedLead = {
      ...this.leads[index],
      ...updateLeadDto,
      updatedAt: Date.now(),
    };
    this.leads[index] = updatedLead;
    return updatedLead;
  }

  async remove(leadId: string) {
    const index = this.leads.findIndex((lead) => lead.id === leadId);
    if (index === -1) {
      return null;
    }
    const [deletedLead] = this.leads.splice(index, 1);
    deletedLead.deletedAt = Date.now();
    return deletedLead;
  }
}
