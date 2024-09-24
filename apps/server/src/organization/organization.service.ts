import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  UpdateOrganizationDto,
  CreateOrganizationDto,
} from './dto/organization.dto';
import { DateHelper } from '@org/utils';
import { LeadStatusService } from 'src/LeadStatus/lead-status.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly LeadStatusService: LeadStatusService) {}
  async create(data: CreateOrganizationDto): Promise<any> {
    try {
      const newOrganization = await prisma.organization.create({
        data: {
          name: data.name,
          description: data.description,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: 0,
          logo: 'https://www.shutterstock.com/shutterstock/photos/2330509313/display_1500/stock-photo-aerial-drone-view-of-shapes-of-cha-gorreana-tea-plantation-at-sao-miguel-azores-portugal-2330509313.jpg',
          deletedAt: 0,
        },
      });
      await prisma.orgMember.create({
        data: {
          organizationId: newOrganization.id,
          userId: data.userId,
          role: 'ADMIN',
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: 0,
          deletedAt: 0,
        },
      });
      const defaultStatus = [
        'Potential',
        'Bad Fit',
        'Qualified',
        'Not Interested',
        'Customer',
        'Interested',
        'Canceled',
      ];
      defaultStatus.map(async (status) => {
        await this.LeadStatusService.create({
          organizationId: newOrganization.id,
          status: status,
        });
      });
      return newOrganization;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to create organization.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(
    userId: string,
  ): Promise<{ organizations: any[]; integrationCount: number }> {
    try {
      const userOrganizations = await prisma.orgMember.findMany({
        where: {
          userId: userId,
        },
        include: {
          organization: true,
        },
      });
      return {
        organizations: userOrganizations,
        integrationCount: userOrganizations.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve organizations.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async delete(id: string): Promise<void> {
  //   try {
  //     const index = this.organizations.findIndex((org) => org.id === id);
  //     if (index === -1) {
  //       throw new HttpException(
  //         'Organization not found.',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     this.organizations.splice(index, 1);
  //   } catch (error) {
  //     throw new HttpException(
  //       'Failed to delete organization.',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async update(
  //   id: string,
  //   updateOrganizationDto: UpdateOrganizationDto,
  // ): Promise<any> {
  //   try {
  //     const organization = this.organizations.find((org) => org.id === id);
  //     if (!organization) {
  //       throw new HttpException(
  //         'Organization not found.',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     Object.assign(organization, updateOrganizationDto, {
  //       updatedAt: Date.now(),
  //     });
  //     return organization;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Failed to update organization.',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
