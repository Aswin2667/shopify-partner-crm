import { Controller, Post, Body, Req, Get, Query, Param } from '@nestjs/common';
import { MailService } from './mail.service';

// TODO: Rework these method with integrartion id
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}


  @Get(':organizationId')
  async getMailsByOrgId(@Param('organizationId') organizationId: string) {
    return this.mailService.getMailsByOrgId(organizationId);
  }



}
