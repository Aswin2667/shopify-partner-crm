// apps/server/src/integration/integration.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  BaseIntegration,
  IntegrationManager,
  IntegrationType,
  validateIntegration,
} from '@org/integrations';
import { config } from 'googleapis/build/src/apis/config';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationManager: IntegrationManager,
  ) {}

  async createIntegration(type: IntegrationType, config: any) {
    try {
      const validationResult = validateIntegration(type, config);

      console.log(validationResult.data);

      if (!validationResult.success) {
        throw new BadRequestException(validationResult.error);
      }

      // Save the integration to your database
      return await this.prisma.integration.create({
        data: {
          ...(config as BaseIntegration), // Use validated data
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Preserve original error message and status code
      }
      console.error('Error creating integration:', error.message);
      throw new InternalServerErrorException(
        'Failed to create integration. Please try again later.',
      );
    }
  }

  async getAllIntegrations() {
    return await this.integrationManager.getAllIntegrations();
  }

  async getIntegrationById(id: string) {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException(`Integration with id ${id} not found`);
    }

    return integration;
  }

  async getAllIntegrationByOrgId(id: string) {
    const integration = await this.prisma.integration.findMany({
      where: { organizationId: id },
    });

    if (!integration) {
      throw new NotFoundException(
        `Integration for OrganizationID ${id} not found`,
      );
    }

    return integration;
  }

  async updateIntegration(id: string, config: any) {
    const integration = await this.getIntegrationById(id);
    if (!integration) {
      throw new NotFoundException(`Integration with id ${id} not found`);
    }

    const validationResult = validateIntegration(
      integration.type as IntegrationType,
      config.data,
    );

    if (!validationResult.success) {
      throw new BadRequestException(validationResult.error);
    }

    return await this.prisma.integration.update({
      where: { id },
      data: {
        ...(validationResult.data as any), // Use validated data
      },
    });
  }

  async deleteIntegration(id: string) {
    const integration = await this.getIntegrationById(id);
    if (!integration) {
      throw new NotFoundException(`Integration with id ${id} not found`);
    }

    await this.prisma.integration.delete({
      where: { id },
    });
    return { message: 'Integration deleted successfully' };
  }

  async connectToIntegration(type: IntegrationType, config: object) {
    // const integration = await this.getIntegrationById(id);
    // if (!integration) {
    //   throw new NotFoundException(`Integration with id ${id} not found`);
    // }

    // const config = { ...integration };

    return await this.integrationManager.connectToIntegration(type, config);
  }

  async disconnectFromIntegration(id: string) {
    const integration = await this.getIntegrationById(id);
    if (!integration) {
      throw new NotFoundException(`Integration with id ${id} not found`);
    }

    return await this.integrationManager.disconnectFromIntegration(
      integration.type as IntegrationType,
    );
  }

  async performIntegrationAction(
    type: IntegrationType,
    action: string,
    params: object,
  ) {
    // const integration = await this.getIntegrationById(id);
    // if (!integration) {
    //   throw new NotFoundException(`Integration with id ${id} not found`);
    // }

    return await this.integrationManager.performIntegrationAction(
      type,
      action,
      params,
    );
  }
}
