import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  UpdateOrganizationDto,
  CreateOrganizationDto,
} from './dto/organization.dto';

@Injectable()
export class OrganizationService {
  private organizations = [];

  findOne(id: string) {
    const organization = this.organizations.find((org) => org.id === id);
    if (!organization) {
      throw new HttpException('Organization not found.', HttpStatus.NOT_FOUND);
    }
    return organization;
  }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<any> {
    try {
      const newOrganization = {
        id: 'org' + Math.floor(Math.random() * 10000),
        ...createOrganizationDto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.organizations.push(newOrganization);
      return newOrganization;
    } catch (error) {
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
      const userOrganizations = this.organizations.filter(
        (org) => org.userId === userId,
      );
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

  async delete(id: string): Promise<void> {
    try {
      const index = this.organizations.findIndex((org) => org.id === id);
      if (index === -1) {
        throw new HttpException(
          'Organization not found.',
          HttpStatus.NOT_FOUND,
        );
      }
      this.organizations.splice(index, 1);
    } catch (error) {
      throw new HttpException(
        'Failed to delete organization.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<any> {
    try {
      const organization = this.organizations.find((org) => org.id === id);
      if (!organization) {
        throw new HttpException(
          'Organization not found.',
          HttpStatus.NOT_FOUND,
        );
      }
      Object.assign(organization, updateOrganizationDto, {
        updatedAt: Date.now(),
      });
      return organization;
    } catch (error) {
      throw new HttpException(
        'Failed to update organization.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
