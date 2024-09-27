import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { IntegrationService } from 'src/integration/integration.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly integrationService: IntegrationService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('orgMemberId') orgMemberId: string,
    @Res() res: Response,
  ) {
    try {
      const [orgMemberId, raw_url] = state.split('url=');
      const [redirect_url, type] = raw_url.split('/create/');

      console.log('state:', state);
      console.log('Redirect URL:', redirect_url);
      console.log('OrgMemberId:', orgMemberId);
      console.log('Type:', type);

      this.integrationService.connectToIntegration(type.toUpperCase() as any, {
        code,
        redirect_url,
        orgMemberId,
      });

      res.redirect(redirect_url);
    } catch (error) {
      res.status(500).send('Error exchanging authorization code');
    }
  }
}

// @Get('google/callback')
// @UseGuards(AuthGuard('google'))
// async googleAuthRedirect(@Req() req, @Res() res: Response) {
//   res.redirect(`http://localhost:3000/compose?token=${req.user.accessToken}`);
// }
