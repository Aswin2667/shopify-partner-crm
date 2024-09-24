import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { DateHelper } from '@org/utils';
import { randomUUID } from 'crypto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LeadActivityService } from 'src/lead-activity/lead-activity.service';
import { PrismaService } from 'src/config/prisma.service';
interface ChargeData {
  charge: {
    amount: {
      amount: string;
    };
  };
  // Add other fields you might need
}

@Injectable()
export class LeadService {
  private leads = [];
  constructor(
    private readonly prismaService: PrismaService,
    private readonly LeadActivityService: LeadActivityService,
  ) {}
  async findAllByOrganizationId(orgId: string) {
    try {
      const rawQuery = `
      SELECT 
       l.id, 
       l."shopifyDomain", 
       l."shopifyStoreId", 
       l."leadSource", 
       l."shopDetails", 
       l.industry, 
       l."createdAt", 
       l."updatedAt", 
       l."deletedAt", 
       l."integrationId", 
       l."organizationId",
       COUNT(lp."projectId") AS projectCount,
       COALESCE(
         json_agg(
           json_build_object(
             'id', p.id,
             'name', p.name,
             'type', p.type,
             'data', p.data,
             'isSynced', p."isSynced",
             'createdAt', p."createdAt",
             'updatedAt', p."updatedAt"
           )
         ) FILTER (WHERE p.id IS NOT NULL), '[]'::json
       ) AS projects,
        ls.status AS leadStatus
     FROM "Lead" l
     LEFT JOIN "LeadProject" lp ON l.id = lp."leadId"
     LEFT JOIN "Project" p ON lp."projectId" = p.id
     LEFT JOIN "LeadStatus" ls ON l."statusId" = ls.id
     WHERE l."organizationId" = $1
     GROUP BY l.id,ls.status
     ORDER BY l."createdAt" DESC;
 `;

      const leads = await prisma.$queryRawUnsafe(rawQuery, orgId);
      console.log(leads);
      return leads;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(leadId: string) {
    try {
      const lead = await this.prismaService.lead.findUnique({
        where: {
          id: leadId,
        },
        include: {
          integration: {
            select: {
              name: true,
              type: true,
            },
          },
          status: true
        }
      });
      if (!lead) {
        return null;
      }
      return lead;
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
      console.log(
        '----------------------------------' + JSON.stringify(createLeadDto),
      );
      const lead = await this.prismaService.lead.create({
        data: {
          shopifyDomain: createLeadDto.myShopifyDomain,
          shopifyStoreId: randomUUID(),
          createdAt: DateHelper.getCurrentUnixTime(),
          leadSource: 'Manually added',
          statusId: createLeadDto.status,
          updatedAt: 0,
          deletedAt: 0,
          organizationId: createLeadDto.organizationId,
        },
      });

      const activity = {
        type: 'LEAD_CREATED',
        data: { message: 'User manually created by' },
        leadId: lead.id,
        userId: createLeadDto.userId,
        organizationId: createLeadDto.organizationId,
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
  async getTotalAmountByLeadId(leadId: string): Promise<any> {
    const leadActivities = await this.prismaService.leadActivity.findMany({
      where: {
        leadId: leadId,
        type: 'SUBSCRIPTION_CHARGE_ACTIVATED',
      },
      select: {
        data: true,
      },
    });

    // console.log(leadActivities); // Debug the retrieved activities
    let currencyCode = '';
    // Reduce and calculate total amount
    const totalAmount = leadActivities.reduce((total, activity: any) => {
      console.log(`Activity: ${JSON.stringify(activity)}`); // Debug the activity
      const activityData = activity.data.payload;
      console.log(activity.data.payload.charge);
      const amountString = activityData.charge?.amount?.amount;
      const amount = amountString ? parseFloat(amountString) : 0;
      currencyCode = activityData.charge?.amount?.currencyCode;
      // console.log(`Amount: ${amount}`); // Debug the parsed amount

      return total + amount;
    }, 0);

    console.log(`Total Amount: ${totalAmount}`); // Debug total amount

    return { totalAmount, currencyCode };
  }
  async getTotalAmountByOrgId(orgId: string): Promise<any> {
    const leadActivities = await this.prismaService.leadActivity.findMany({
      where: {
        orgId: orgId,
        type: 'SUBSCRIPTION_CHARGE_ACTIVATED',
      },
      select: {
        data: true,
      },
    });

    // console.log(leadActivities); // Debug the retrieved activities
    let currencyCode = '';
    // Reduce and calculate total amount
    const totalAmount = leadActivities.reduce((total, activity: any) => {
      console.log(`Activity: ${JSON.stringify(activity)}`);
      const activityData = activity.data.payload;
      console.log(activity.data.payload.charge);
      const amountString = activityData.charge?.amount?.amount;
      const amount = amountString ? parseFloat(amountString) : 0;
      currencyCode = activityData.charge?.amount?.currencyCode;
      // console.log(`Amount: ${amount}`); // Debug the parsed amount

      return total + amount;
    }, 0);

    console.log(`Total Amount: ${totalAmount}`); // Debug total amount

    return { totalAmount, currencyCode };
  }
}
