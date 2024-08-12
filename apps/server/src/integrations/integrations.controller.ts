import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
    BadRequestException,
  } from '@nestjs/common';
  import { IntegrationsService } from './integrations.service';
  import {
    CreateIntegrationDto,
    UpdateIntegrationDto,
  } from './dto/integrations.dto';
  import z from "zod"
  
  @Controller('integration')
  export class IntegrationsController {
    constructor(private readonly integrationsService: IntegrationsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createIntegrationDto: any) {
      // Manually validate with Zod
      const parsedData = this.validateDto(CreateIntegrationDto, createIntegrationDto);
      return this.integrationsService.create(parsedData);
    }
  
    @Get(':organizationId/all')
    async findAll(@Param('organizationId') organizationId: string) {
      return this.integrationsService.findAll(organizationId);
    }
  
    @Get(':integrationId')
    async findOne(@Param('integrationId') id: string) {
      return this.integrationsService.findOne(id);
    }
  
    @Put(':integrationId')
    async update(
      @Param('integrationId') id: string,
      @Body() updateIntegrationDto: any,
    ) {
      // Manually validate with Zod
      const parsedData = this.validateDto(UpdateIntegrationDto, updateIntegrationDto);
      return this.integrationsService.update(id, parsedData);
    }
  
    @Delete(':integrationId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('integrationId') id: string) {
      return this.integrationsService.remove(id);
    }
  
    // @Post('connect/:integrationId')
    // async connect(@Param('integrationId') id: string, @Body('partnerId') partnerId: string) {
    //   return this.integrationsService.connect(id, partnerId);
    // }
  
    // @Post('disconnect/:integrationId')
    // async disconnect(@Param('integrationId') id: string, @Body('partnerId') partnerId: string) {
    //   return this.integrationsService.disconnect(id, partnerId);
    // }
  
    // Private helper method for validation
    private validateDto(schema: z.ZodType<any>, data: any) {
      const result = schema.safeParse(data);
      if (!result.success) {
        throw new BadRequestException(result.error.errors);
      }
      return result.data;
    }
  }
  