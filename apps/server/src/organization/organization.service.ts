import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  UpdateOrganizationDto,
  CreateOrganizationDto,
} from './dto/organization.dto';
import { DateHelper } from '@org/utils';
import { LeadStatusService } from 'src/LeadStatus/lead-status.service';
import { PrismaService } from '@org/data-source';

@Injectable()
export class OrganizationService {

  constructor(
    private readonly LeadStatusService: LeadStatusService,
    private readonly prisma: PrismaService,
  ) {}

  async update(id: string, data: UpdateOrganizationDto) {
    try {
       const organization = await this.prisma.organization.findUnique({ where: { id } });
      if (!organization) {
        throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
      }
  
      return this.prisma.organization.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          updatedAt: DateHelper.getCurrentUnixTime(),
          logo: data.logo,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'An unexpected error occurred while updating the organization.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  
  async create(data: CreateOrganizationDto): Promise<any> {
    try {
      const newOrganization = await this.prisma.organization.create({
        data: {
          name: data.name,
          description: data.description,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: 0,
          logo: data.logo,
          deletedAt: 0,
        },
      });
      await this.prisma.orgMember.create({
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
        'Qualified',
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
      const userOrganizations = await this.prisma.orgMember.findMany({
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
