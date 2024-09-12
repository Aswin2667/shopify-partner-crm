import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeadStatusService } from './lead-status.service';
import { CreateLeadStatusDto, UpdateLeadStatusDto } from './dto/lead-status.dto';

@Controller('lead-status')
export class LeadStatusController {
  constructor(private readonly leadStatusService: LeadStatusService) {}

  @Post()
  async create(@Body() createLeadStatusDto: CreateLeadStatusDto) {
    console.log(createLeadStatusDto)
    return this.leadStatusService.create(createLeadStatusDto);
  }

  @Get(':orgId')
  async findAll(@Param('orgId') orgId: string) {
    return this.leadStatusService.findAllByOrgId(orgId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadStatusService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeadStatusDto: UpdateLeadStatusDto) {
    return this.leadStatusService.update(id, updateLeadStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.leadStatusService.remove(id);
  }
}
