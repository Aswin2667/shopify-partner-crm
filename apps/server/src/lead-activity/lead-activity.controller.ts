import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LeadActivityService } from './lead-activity.service';
import { CreateLeadActivityDto } from './dto/lead-activity.dto';

@Controller('lead-activity')
export class LeadActivityController {
  constructor(private readonly leadActivityService: LeadActivityService) {}

  @Post()
  create(@Body() createLeadActivityDto: CreateLeadActivityDto) {
    return this.leadActivityService.create(createLeadActivityDto);
  }

  @Get()
  findAll() {
    return this.leadActivityService.findAllByLeadId();
  }
}
