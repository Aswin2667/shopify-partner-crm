import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { EmailClickService } from './email.click.service';

@Controller('click')
export class ClickController {
  private readonly logger = new Logger(ClickController.name);

  constructor(private readonly clickService: EmailClickService) {}

  @Get('track')
  async trackClick(
    @Query('redirect') redirectUrl: string,
    @Query('id') id: string,
    @Res() res: Response,
  ) {
    this.logger.log('Link clicked from IP:',);
    console.log(id)
    await this.clickService.logClick(res.req.ip);

    if (redirectUrl) {
      return res.redirect(redirectUrl);
    } else {
      return res.status(400).send('Invalid redirect URL');
    }
  }
}
