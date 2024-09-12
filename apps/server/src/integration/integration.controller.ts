// apps/server/src/integration/integration.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationType } from '@org/integrations';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  async createIntegration(
    @Body() createIntegrationDto: { type: IntegrationType; config: any },
  ) {
    try {
      return await this.integrationService.createIntegration(
        createIntegrationDto.type,
        createIntegrationDto.config,
      );
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      console.error('Error in controller:', error.message);
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @Get()
  async getAllIntegrations() {
    return await this.integrationService.getAllIntegrations();
  }

  @Get(':id')
  async getIntegrationById(@Param('id') id: string) {
    return await this.integrationService.getIntegrationById(id);
  }

  @Get('/getAll/:id')
  async getAllIntegrationByOrgId(@Param('id') id: string) {
    return await this.integrationService.getAllIntegrationByOrgId(id);
  }

  @Put(':id')
  async updateIntegration(
    @Param('id') id: string,
    @Body() updateIntegrationDto: { config: any },
  ) {
    return await this.integrationService.updateIntegration(
      id,
      updateIntegrationDto.config,
    );
  }

  @Delete(':id')
  async deleteIntegration(@Param('id') id: string) {
    return await this.integrationService.deleteIntegration(id);
  }

  @Post('connect')
  async connectToIntegration(@Body() config: any) {
    return await this.integrationService.connectToIntegration(
      config.type,
      config,
    );
  }

  @Post(':id/disconnect')
  async disconnectFromIntegration(@Param('id') id: string) {
    return await this.integrationService.disconnectFromIntegration(id);
  }

  @Post('action')
  async performIntegrationAction(
    @Body()
    performActionDto: {
      type: IntegrationType;
      action: string;
      params: object;
    },
  ) {
    return await this.integrationService.performIntegrationAction(
      performActionDto.type,
      performActionDto.action,
      performActionDto.params,
    );
  }

  @Post('createFromEmail')
  async createFromEmail(@Body() data: any) {
    return await this.integrationService.createFromEmail(data);
  }
}
