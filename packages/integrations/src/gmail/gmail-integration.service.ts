import { Injectable } from '@nestjs/common';
import { GmailIntegration } from './gmail-integration.interface';
import { BaseIntegrationService } from '../base/base-integration.service';
import {
  INTEGRATION_SINGULARITY,
  IntegrationData,
  IntegrationType,
} from '../types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import axios from 'axios';
import { ConnectConfig } from './types';
import { Prisma, PrismaService } from '@org/data-source';
import { DateHelper } from '@org/utils';

@Injectable()
export class GmailIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'Gmail',
    description: 'Gmail integration',
    type: IntegrationType.GMAIL,
    logo: 'https://www.gstatic.com/images/branding/product/1x/gmail_512dp.png',
    singular: INTEGRATION_SINGULARITY.GMAIL,
    authType: 'OAUTH2',
  };

  constructor(
    @InjectQueue('gmail_integration_events')
    private readonly integrationQueue: Queue,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async connect(config: ConnectConfig): Promise<any> {
    const { code, redirect_url } = config;
    const organizationId = redirect_url.split('/').filter(Boolean)[2];
    try {
      // Exchange code for access token and refresh token
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: 'http://localhost:8080/auth/google/callback',
          grant_type: 'authorization_code',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log(tokenResponse.data);
      const { access_token, refresh_token, id_token } = tokenResponse.data;

      // Decode ID token to get user info
      const userInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const { id: googleId, email, name } = userInfoResponse.data;

      const data = {
        googleId,
        accessToken: access_token,
        refreshToken: refresh_token ?? null, // Store null if refresh_token is undefined
        email,
        name,
        organizationId,
        type: IntegrationType.GMAIL,
        isSingular: INTEGRATION_SINGULARITY.GMAIL,
      };

      const integrationExists = await this.prisma.integration.findFirst({
        where: {
          data: {
            path: ['email'],
            equals: data.email,
          },
        },
      });

      //   Creates new integration if not exists if exists will update the integration's accesstoken alone
      if (integrationExists) {
        return await this.prisma.integration.update({
          where: {
            id: integrationExists.id,
          },
          data: {
            data: {
              googleId: data.googleId,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              email: data.email,
              name: data.name,
            } as unknown as Prisma.JsonValue,
            updatedAt: DateHelper.getCurrentUnixTime(),
          },
        });
      } else {
        return await this.prisma.integration.create({
          data: {
            name: `${data.name}'s Gmail Integration`,
            description: `Integration with Gmail for ${data.email}`,
            type: data.type,
            isSingular: data.isSingular,
            organizationId: data.organizationId,
            data: {
              googleId: data.googleId,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              email: data.email,
              name: data.name,
            } as unknown as Prisma.JsonValue,
            createdAt: DateHelper.getCurrentUnixTime(),
            updatedAt: DateHelper.getCurrentUnixTime(),
            deletedAt: BigInt(0), // Assuming 0 means not deleted
          },
        });
      }
      // await this.integrationQueue.add('CONNECT_TO_GMAIL', data);
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw new Error('Failed to handle OAuth callback');
    }
  }

  disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async performAction(action: string, params: any): Promise<any> {
    if (action === 'sendEmail') {
      const emailData = params;
      const integration = params.integration;
      const response = this.sendEmail(integration, emailData);
      console.log(response);
      return await Promise.resolve(response);
    }
    throw new Error('Method not implemented.');
  }

  getIntegrationData(): IntegrationData {
    return this.data;
  }

  private sendEmail(integration: GmailIntegration, emailData: any) {
    // Logic to send email via Gmail
    return { data: { message: 'Email sent successfully' }, error: null };
  }
}
