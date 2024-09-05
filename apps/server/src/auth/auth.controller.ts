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
    @Query('state') redirect_url: string,
    @Query('type') typee: string,
    @Res() res: Response,
  ) {
    try {
      console.log(redirect_url);
      console.log(typee);
      const type: any = redirect_url.split('/').filter(Boolean).pop();
      console.log(type);
      this.integrationService.connectToIntegration(type.toUpperCase() as any, {
        code,
        redirect_url,
      });
      // const organizationId = redirect_url.split('/').filter(Boolean)[2];
      // const { accessToken, refreshToken } =
      //   await this.authService.handleOAuthCallback(code, organizationId);
      // // Send tokens to client or store them temporarily in session
      // res.cookie('accessToken', accessToken, { httpOnly: true });
      // res.cookie('refreshToken', refreshToken, { httpOnly: true });
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
