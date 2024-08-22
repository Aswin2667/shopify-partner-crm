import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get(':orgId')
  async findAllByIntegrationId(@Param('orgId') appId: string) {
    try {
      const leads = await this.leadService.findAllByIntegrationId(appId);
      return {
        status: true,
        message: 'Got Lead using the OrgId',
        data: leads,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get/:leadId')
  async findOne(@Param('leadId') leadId: string) {
    try {
      const lead = await this.leadService.findOne(leadId);
      if (!lead) {
        throw new HttpException('Lead not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: true,
        message: 'Got the user using the leadId',
        data: lead,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  async create(@Body() createLeadDto: CreateLeadDto) {
    try {
      const lead = await this.leadService.create(createLeadDto);
      return {
        status: true,
        message: 'Lead created successfully.',
        data: lead,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('update/:leadId')
  async update(
    @Param('leadId') leadId: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    try {
      const lead = await this.leadService.update(leadId, updateLeadDto);
      if (!lead) {
        throw new HttpException('Lead not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: true,
        message: 'Lead updated successfully.',
        data: lead,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('delete/:leadId')
  async remove(@Param('leadId') leadId: string) {
    try {
      const result = await this.leadService.remove(leadId);
      if (!result) {
        throw new HttpException('Lead not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: true,
        message: 'Lead deleted successfully.',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
