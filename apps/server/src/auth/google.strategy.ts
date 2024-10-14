import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '132861762148-dhkdcu4kmkv3p3drdr6n1l3m748mbfk1.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
      callbackURL: 'https://shopcrm-server-5e5331b6be39.herokuapp.com/auth/google/callback',
      // callbackURL: 'http://localhost:8080/integration/connect',
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/gmail.send'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, displayName } = profile;
    const user = {
      email: emails[0].value,
      displayName,
      accessToken,
    };
    done(null, user);
  }
}
