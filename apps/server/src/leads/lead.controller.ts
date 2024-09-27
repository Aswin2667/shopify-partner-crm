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
  Query,
  Put,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get(':orgId')
  async findAllByOrganizationId(
    @Param('orgId') orgId: string,
    @Query('shopifyDomain') shopifyDomain?: string,
    @Query('domainFilterOption') domainFilterOption?: string,
    @Query('leadStatusFilterOption') leadStatusFilterOption?: string,
    @Query('selectedStatuses') selectedStatuses?: string | undefined,
    @Query('createdAt') createdAt?: any,
    @Query('DateOption') DateFilterOption?: string,
    @Query('DateComparison') DateFilterComparision?: string,
  ) {
    try {
      console.log(
        shopifyDomain,
        domainFilterOption,
        leadStatusFilterOption,
        selectedStatuses,
        createdAt,
        DateFilterOption,
        DateFilterComparision,
      );
      const leads = await this.leadService.findAllByOrganizationId(
        orgId,
        shopifyDomain,
        domainFilterOption,
        leadStatusFilterOption,
        selectedStatuses,
        createdAt,
        DateFilterOption,
        DateFilterComparision,
      );

      return {
        status: true,
        message: 'Successfully retrieved leads',
        data: leads,
      };
    } catch (error) {
      // Handle the error accordingly
      return {
        status: false,
        message: error.message,
        data: null,
      };
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

  @Put('/:leadId/status')
  async updateStatus(@Param('leadId') leadId: string, @Body() statusData: any) {
    try {
      const lead = await this.leadService.findOne(leadId);
      console.log(statusData);
      if (!lead) {
        throw new HttpException('Lead not found', HttpStatus.NOT_FOUND);
      }
      const updatedLead = await this.leadService.updateStatsus(
        leadId,
        statusData,
      );
      return {
        status: true,
        message: 'Got the user using the leadId',
        data: updatedLead,
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
      // const lead = await this.leadService.update(leadId, updateLeadDto);
      // if (!lead) {
      //   throw new HttpException('Lead not found', HttpStatus.NOT_FOUND);
      // }
      // return {
      //   status: true,
      //   message: 'Lead updated successfully.',
      //   data: lead,
      // };
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
  @Get('total-amount/:leadId')
  async getTotalAmount(@Param('leadId') leadId: string) {
    const totalAmount = await this.leadService.getTotalAmountByLeadId(leadId);
    return {
      status: true,
      message: `Total amount for lead ${leadId}`,
      data: totalAmount,
    };
  }
  @Get('total-revenue/:orgId')
  async getTotalRevenue(@Param('orgId') orgId: string) {
    const totalAmount = await this.leadService.getTotalAmountByOrgId(orgId);
    return {
      status: true,
      message: `Total amount for orgId ${orgId}`,
      data: totalAmount,
    };
  }
}
