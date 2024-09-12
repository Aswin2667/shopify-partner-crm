import { Controller, Get, Res, Logger, Query } from '@nestjs/common';
import { Response } from 'express';
import { EmailOpenService } from './email.open.service';

@Controller('email-open')
export class EmailOpenController {
  private readonly logger = new Logger(EmailOpenController.name);

  constructor(private readonly emailOpenService: EmailOpenService) {}

  @Get('1px-image')
  serveTrackingImage(@Res() res: Response, @Query('id') id: string) {
    this.logger.log('Email opened from IP:', res.req.ip);
    res.setHeader('Content-Type', 'image/png');
    const onePxImageBase64 = this.emailOpenService.getOnePixelImage(id);
    res.send(Buffer.from(onePxImageBase64, 'base64'));
  }
}