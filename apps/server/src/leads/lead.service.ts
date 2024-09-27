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
import { LeadQueryBuilder } from 'src/queryBuilders/LeadQueryBuilder';
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
  async findAllByOrganizationId(
    orgId: string,
    shopifyDomain?: string,
    domainFilterOption?: string,
    leadStatusFilterOption?: string,
    selectedStatuses?: string | undefined,
    createdAt?: any,
    DateFilterOption?: string,
    DateFilterComparision?: string,
  ) {
    try {
      // let filters: string[] = []; // Initialize filters array

      // // Shopify Domain Filter
      // if (shopifyDomain && domainFilterOption) {
      //   switch (domainFilterOption) {
      //     case 'contains':
      //       filters.push(`l."shopifyDomain" LIKE '%${shopifyDomain}%'`);
      //       break;
      //     case 'does-not-contain':
      //       filters.push(`l."shopifyDomain" NOT LIKE '%${shopifyDomain}%'`);
      //       break;
      //     case 'contains phrase':
      //       filters.push(`l."shopifyDomain" LIKE '%${shopifyDomain}%'`);
      //       break;
      //     case 'does not contain phrase':
      //       filters.push(`l."shopifyDomain" NOT LIKE '%${shopifyDomain}%'`);
      //       break;
      //     case 'is exactly':
      //       filters.push(`l."shopifyDomain" = '${shopifyDomain}'`);
      //       break;
      //     case 'is not exactly':
      //       filters.push(`l."shopifyDomain" != '${shopifyDomain}'`);
      //       break;
      //     case 'contains words starting with':
      //       filters.push(`l."shopifyDomain" LIKE '${shopifyDomain}%'`);
      //       break;
      //     case 'does not contain words starting':
      //       filters.push(`l."shopifyDomain" NOT LIKE '${shopifyDomain}%'`);
      //       break;
      //     default:
      //       console.warn(
      //         `Unhandled domain filter option: ${domainFilterOption}`,
      //       );
      //       break;
      //   }
      // }
      // // Lead Status Filter
      // if (leadStatusFilterOption && selectedStatuses?.length > 0) {
      //   const selectedStatusesArray = JSON.parse(selectedStatuses);

      //   console.log(selectedStatusesArray.length);

      //   const statusPlaceholders = selectedStatusesArray
      //     ?.map((status) => `'${status.value}'`)
      //     .join(', ');
      //   filters.push(
      //     `ls.id ${leadStatusFilterOption === 'is not any of' ? '  NOT IN ' : ' IN '} (${statusPlaceholders})`,
      //   );
      // }

      // // Created At Filter
      // if (createdAt) {
      //   const startDate = createdAt.startDate || '2023-01-01';
      //   const endDate = createdAt.endDate || '2023-12-31';
      //   filters.push(`l."createdAt" BETWEEN '${startDate}' AND '${endDate}'`);
      // }
      // console.log(`
      //   SELECT
      //     l.id,
      //     l."shopifyDomain",
      //     l."shopifyStoreId",
      //     l."leadSource",
      //     l."shopDetails",
      //     l.industry,
      //     l."createdAt",
      //     l."updatedAt",
      //     l."deletedAt",
      //     l."integrationId",
      //     l."organizationId",
      //     COUNT(lp."projectId") AS projectCount,
      //     COALESCE(
      //       json_agg(
      //         json_build_object(
      //           'id', p.id,
      //           'name', p.name,
      //           'type', p.type,
      //           'data', p.data,
      //           'isSynced', p."isSynced",
      //           'createdAt', p."createdAt",
      //           'updatedAt', p."updatedAt"
      //         )
      //       ) FILTER (WHERE p.id IS NOT NULL), '[]'::json
      //     ) AS projects,
      //     ls.status AS leadStatus
      //   FROM "Lead" l
      //   LEFT JOIN "LeadProject" lp ON l.id = lp."leadId"
      //   LEFT JOIN "Project" p ON lp."projectId" = p.id
      //   LEFT JOIN "LeadStatus" ls ON l."statusId" = ls.id
      //   WHERE l."organizationId" = '${orgId}'
      //   ${filters.length ? ` AND ${filters.join(' AND ')}` : ''}
      //   GROUP BY l.id, ls.status
      //   ORDER BY l."createdAt" DESC;
      // `);
      // const leads = await this.prismaService.$queryRawUnsafe(`
      //   SELECT
      //     l.id,
      //     l."shopifyDomain",
      //     l."shopifyStoreId",
      //     l."leadSource",
      //     l."shopDetails",
      //     l.industry,
      //     l."createdAt",
      //     l."updatedAt",
      //     l."deletedAt",
      //     l."integrationId",
      //     l."organizationId",
      //     COUNT(lp."projectId") AS projectCount,
      //     COALESCE(
      //       json_agg(
      //         json_build_object(
      //           'id', p.id,
      //           'name', p.name,
      //           'type', p.type,
      //           'data', p.data,
      //           'isSynced', p."isSynced",
      //           'createdAt', p."createdAt",
      //           'updatedAt', p."updatedAt"
      //         )
      //       ) FILTER (WHERE p.id IS NOT NULL), '[]'::json
      //     ) AS projects,
      //     ls.status AS leadStatus
      //   FROM "Lead" l
      //   LEFT JOIN "LeadProject" lp ON l.id = lp."leadId"
      //   LEFT JOIN "Project" p ON lp."projectId" = p.id
      //   LEFT JOIN "LeadStatus" ls ON l."statusId" = ls.id
      //   WHERE l."organizationId" = '${orgId}'
      //   ${filters.length ? ` AND ${filters.join(' AND ')}` : ''}
      //   GROUP BY l.id, ls.status
      //   ORDER BY l."createdAt" DESC;
      // `);

      const queryBuilder = new LeadQueryBuilder();

      queryBuilder.addShopifyDomainFilter(shopifyDomain, domainFilterOption);
      queryBuilder.addLeadStatusFilter(
        leadStatusFilterOption,
        selectedStatuses,
      );
      queryBuilder.addCreatedAtFilter(
        createdAt,
        DateFilterOption,
        DateFilterComparision,
      );

      const query = queryBuilder.buildQuery(orgId);

      const leads = await this.prismaService.$queryRawUnsafe(query);

      // Log the query (optional for debugging purposes)
      console.log(query);
      return leads;
    } catch (error) {
      console.error('Error retrieving leads:', error);
      throw new Error('Could not retrieve leads');
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
          status: true,
        },
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

  async updateStatsus(leadId: string, updateLeadDto: UpdateLeadDto) {
    try {
      const oldLeadStatus = await this.prismaService.lead.findFirst({
        where: {
          id: leadId,
          organizationId: updateLeadDto.orgId,
        },
        include: {
          status: true,
        },
      }); // Get the previous leadStatus
      const data = await this.prismaService.lead.update({
        where: {
          id: leadId,
          organizationId: updateLeadDto.orgId,
        },
        data: {
          statusId: updateLeadDto.status,
        },
      });
      console.log(data);
      const activity = {
        type: 'STATUS_CHANGE',
        data: {
          message: 'updated by',
          statusFrom: oldLeadStatus.status.status,
          statusTo: updateLeadDto.statusData.status,
        },
        leadId: leadId,
        userId: updateLeadDto.userId,
        organizationId: updateLeadDto.orgId,
      };
      console.log(activity);
      await this.LeadActivityService.create(activity);
      return data;
    } catch (error) {}
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
      const activityData = activity.data.payload;
      const amountString = activityData.charge?.amount?.amount;
      const amount = amountString ? parseFloat(amountString) : 0;
      currencyCode = activityData.charge?.amount?.currencyCode;
      // console.log(`Amount: ${amount}`); // Debug the parsed amount

      return total + amount;
    }, 0);

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
      const activityData = activity.data.payload;
      const amountString = activityData.charge?.amount?.amount;
      const amount = amountString ? parseFloat(amountString) : 0;
      currencyCode = activityData.charge?.amount?.currencyCode;
      // console.log(`Amount: ${amount}`); // Debug the parsed amount

      return total + amount;
    }, 0);

    return { totalAmount, currencyCode };
  }
}
