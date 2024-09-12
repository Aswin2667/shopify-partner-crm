import { Controller, Post, Body, Req, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

// TODO: Rework these method with integrartion id
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async getMails(@Query('integrationId') integrationId: string) {
    // const emails = await this.prisma.email.findMany({
    //   where: { integrationId },
    //   include: { replies: true },
    // });
    // return emails;
    return this.mailService.getMails(integrationId);
  }

  @Get('list')
  async getMailList(@Query('integrationId') integrationId: string) {
    return this.mailService.getMailList(integrationId);
  }

  @Post('send')
  async sendMail(
    @Body()
    body: {
      to: string[];
      cc?: string[];
      bcc?: string[];
      subject: string;
      body: string;
      accessToken: string;
      refreshToken: string;
      gmailIntegrationId: string;
    },
    @Req() req,
  ) {
    await this.mailService.sendMail(
      body.to,
      body.cc || [],
      body.bcc || [],
      body.subject,
      body.body,
      body.refreshToken,
      body.accessToken,
      body.gmailIntegrationId,
    );
    return { message: 'Mail sent successfully' };
  }

  @Get('verify')
  async verifyToken(@Req() req) {
    const { token: accessToken } = req.query;
    const response = await this.mailService.verifyToken(accessToken);
    return response;
  }

  @Post('sync/start')
  async startSync(@Body('integrationId') integrationId: string) {
    // await this.mailService.startSync(integrationId);
    return { message: 'Sync started' };
  }
}
