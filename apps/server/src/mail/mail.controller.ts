import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { MailService } from './mail.service';

// TODO: Rework these method with integrartion id
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('org/:organizationId')
  async getMailsByOrgId(@Param('organizationId') organizationId: string) {
    return this.mailService.getMailsByOrgId(organizationId);
  }

  @Get('lead/:leadId')
  async getMailsByLeadId(@Param('leadId') leadId: string) {
    return this.mailService.getMailsByLeadId(leadId);
  }

  // From Email(Send As)
  @Get('org/:organizationId/fromEmails')
  async getFromEmailsByOrgId(@Param('organizationId') organizationId: string) {
    return this.mailService.getFromEmailsByOrgId(organizationId);
  }

  @Post('createFromEmail')
  async createFromEmail(@Body() data: any) {
    return await this.mailService.createFromEmail(data);
  }

  @Patch('updateFromEmail/:id')
  async updateFromEmail(@Param('id') id: any, @Body() data: any) {
    return await this.mailService.updateFromEmail(id, data);
  }

  @Delete('deleteFromEmail/:id')
  async deleteFromEmail(@Param('id') id: any) {
    return await this.mailService.deleteFromEmail(id);
  }
}
