import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  UpdateOrganizationDto,
  CreateOrganizationDto,
} from './dto/organization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    try {
      console.log(createOrganizationDto);
      const organization = await this.organizationService.create(
        createOrganizationDto,
      );

      return {
        status: true,
        message: 'Organization created successfully.',
        data: organization,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while creating the organization.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':userId')
  async getOrganizationsByUserId(@Param('userId') userId: string) {
    try {
      const { organizations, integrationCount } =
        await this.organizationService.findByUserId(userId);
      return {
        status: true,
        message: 'Organizations retrieved successfully.',
        data: organizations,
        integrationCount,
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while retrieving the organizations.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id: string) {
    try {
      // await this.organizationService.delete(id);
      return {
        status: true,
        message: 'Organization deleted successfully.',
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while deleting the organization.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    try {
      // const updatedOrganization = await this.organizationService.update(
      //   id,
      //   updateOrganizationDto,
      // );
      return {
        status: true,
        message: 'Organization name updated successfully.',
        // data: updatedOrganization,
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while updating the organization.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/id/:id')
  async getOrganizationById(@Param('id') id: string) {
    try {
      // const organization = await this.organizationService.findOne(id);
      return {
        status: true,
        message: 'Organization retrieved successfully.',
        // data: organization,
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while retrieving the organization.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/dashboard/:id')
  async getOrganizationDashboardById(@Param('id') id: string) {
    // try {
    //   const organization = await this.organizationService.getDashboardData(id);
    //   return {
    //     status: true,
    //     message: 'Organization retrieved successfully.',
    //     // data: organization,
    //   };
    // } catch (error) {
    //   throw new HttpException(
    //     error.message ||
    //       'An unexpected error occurred while retrieving the organization.',
    //     error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
