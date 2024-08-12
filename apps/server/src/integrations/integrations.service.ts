import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
  } from '@nestjs/common';
import prisma from "../shared/utils/prisma";
  import { CreateIntegrationDto, UpdateIntegrationDto } from './dto/integrations.dto';
  import { DateHelper } from "@org/utils"
  
  @Injectable()
  export class IntegrationsService {

    async create(createIntegrationDto: any) {
      // Check if an integration with the same name already exists for the organization
      const existingIntegration = await prisma.integration.findFirst({
        where: {
          name: createIntegrationDto.name,
          organizationId: createIntegrationDto.organizationId,
        },
      });
  
      if (existingIntegration) {
        throw new BadRequestException('Integration with this name already exists.');
      }
  
      // Create and save the new integration
      return prisma.integration.create({
        data: {
          ...createIntegrationDto,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: DateHelper.getCurrentUnixTime(),
          deletedAt: 0,
        },
      });
    }
  
    async findAll(organizationId: string) {
      // Retrieve all integrations for a specific organization
      return prisma.integration.findMany({
        where: { organizationId },
      });
    }
  
    async findOne(id: string) {
      // Retrieve a single integration by its ID
      const integration = await prisma.integration.findUnique({
        where: { id },
      });
  
      if (!integration) {
        throw new NotFoundException('Integration not found');
      }
  
      return integration;
    }
  
    async update(id: string, updateIntegrationDto: any) {
      // Check if the integration exists
      const existingIntegration = await prisma.integration.findUnique({
        where: { id },
      });
  
      if (!existingIntegration) {
        throw new NotFoundException('Integration not found');
      }
  
      // Update the integration details
      return prisma.integration.update({
        where: { id },
        data: {
          ...updateIntegrationDto,
          updatedAt: DateHelper.getCurrentUnixTime(),
        },
      });
    }
  
    async remove(id: string) {
      // Soft delete the integration (mark it as deleted)
      const integration = await prisma.integration.findUnique({
        where: { id },
      });
  
      if (!integration) {
        throw new NotFoundException('Integration not found');
      }
  
      return prisma.integration.update({
        where: { id },
        data: { deletedAt: DateHelper.getCurrentUnixTime() },
      });
    } 
  
    // async connect(id: string, partnerId: string) {
    //   // Validate if the integration can be connected with the partner
    //   const integration = await prisma.integration.findUnique({
    //     where: { id },
    //   });
  
    //   if (!integration) {
    //     throw new NotFoundException('Integration not found');
    //   }
  
    //   // Simulate connection logic (this could involve external API calls)
    //   if (partnerId !== integration.data.partnerId) {
    //     throw new UnauthorizedException('Invalid partner ID');
    //   }
  
    //   // Simulate a successful connection
    //   return { message: 'Integration connected successfully' };
    // }
  
    // async disconnect(id: string, partnerId: string) {
    //   // Validate if the integration can be disconnected from the partner
    //   const integration = await prisma.integration.findUnique({ 
    //     where: { id },
    //   });
  
    //   if (!integration) {
    //     throw new NotFoundException('Integration not found');
    //   }
  
    //   // Simulate disconnection logic (this could involve external API calls)
    //   if (partnerId !== integration.data.partnerId) {
    //     throw new UnauthorizedException('Invalid partner ID');
    //   }
  
    //   // Simulate a successful disconnection
    //   return { message: 'Integration disconnected successfully' };
    // }
  }
  