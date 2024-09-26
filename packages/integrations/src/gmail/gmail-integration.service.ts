import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { BaseIntegrationService } from '../base/base-integration.service';
import {
  INTEGRATION_SINGULARITY,
  IntegrationData,
  IntegrationType,
} from '../types';
import axios from 'axios';
import { google } from 'googleapis';
import { ConnectConfig, GmailAction } from './types';
import { Prisma, PrismaService } from '@org/data-source';
import { DateHelper } from '@org/utils';
import { getTrackingImage } from 'src/helper';

@Injectable()
export class GmailIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'Gmail',
    description:
      'Seamlessly integrate your inbox with our CRM. Track conversations, send emails, and manage customer relationships—all from one platform.',
    type: IntegrationType.GMAIL,
    logo: 'https://www.gstatic.com/images/branding/product/1x/gmail_512dp.png',
    singular: INTEGRATION_SINGULARITY.GMAIL,
    authType: 'OAUTH2',
  };

  private oauth2Client;
  private readonly tokenInfoUrl =
    'https://www.googleapis.com/oauth2/v3/tokeninfo';
  private readonly logger = new Logger(GmailIntegrationService.name);

  constructor(private readonly prisma: PrismaService) {
    super();
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:8080/auth/google/callback',
    );
  }

  getIntegrationData(): IntegrationData {
    return this.data;
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
    if (action === GmailAction.SEND_MAIL) {
      return await this.sendMail(params);
    } else {
      throw new Error('Invalid action');
    }
  }

  /* PRIVATE METHODS TO PERFORM SEND MAIL ACTION STARTS */
  private async sendMail(emailData: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    refreshToken: string;
    accessToken: string;
    gmailIntegrationId: string;
  }) {
    const {
      to,
      cc,
      bcc,
      subject,
      body,
      gmailIntegrationId,
      accessToken,
      refreshToken,
    } = emailData;
    try {
      await this.verifyToken(accessToken);
      this.oauth2Client.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      const customMessageId = `<${this.generateCustomMessageId()}>`;

      const headers = this.buildEmailHeaders(
        to,
        cc,
        bcc,
        subject,
        customMessageId,
      );
      const trackingId:string = uuidv4();
      const bodyWithTrackingImage = getTrackingImage(body, trackingId);
        
      console.log(bodyWithTrackingImage);
      const message = `${headers}\r\n\r\n${bodyWithTrackingImage}`;
      const encodedMessage = this.encodeMessage(message);

      const mailResponse = await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      });

      this.handleGmailResponse(mailResponse);

      const response = await this.fetchEmailDetails(
        mailResponse.data.id,
        accessToken,
      );

      this.logger.log('Mail sent successfully');

      return await this.storeEmailInDatabase(
        response.data,
        to,
        cc,
        bcc,
        subject,
        body,
        gmailIntegrationId,
        trackingId,
      );
    } catch (error) {
      await this.handleError(
        error,
        refreshToken,
        gmailIntegrationId,
        to,
        cc,
        bcc,
        subject,
        body,
      );
    }
  }

  private generateCustomMessageId() {
    return `${Math.random().toString(36).substr(2, 9)}@mail.gmail.com`;
  }

  private buildEmailHeaders(to, cc, bcc, subject, customMessageId) {
    return [
      `From: "Dinesh Balan S" <dineshbalan@gmail.com>`,
      `To: ${to.join(', ')}`,
      cc.length ? `Cc: ${cc.join(', ')}` : '',
      bcc.length ? `Bcc: ${bcc.join(', ')}` : '',
      `Subject: ${subject}`,
      `X-Message-ID: ${customMessageId}`,
      `Content-Type: text/html; charset="UTF-8"`,
    ]
      .filter(Boolean)
      .join('\r\n');
  }

  private encodeMessage(message: string) {
    return Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private handleGmailResponse(mailResponse: any) {
    if (mailResponse.statusText !== 'OK') {
      throw new Error(mailResponse.statusText);
    }
  }

  private async verifyToken(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(this.tokenInfoUrl, {
        params: { access_token: accessToken },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid or expired token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async fetchEmailDetails(emailId: string, accessToken: string) {
    return axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  private async storeEmailInDatabase(
    emailData,
    to,
    cc,
    bcc,
    subject,
    body,
    gmailIntegrationId,
    trackingId,
  ) {
    return await this.prisma.email.create({
      data: {
        to: to,
        cc: cc,
        bcc: bcc,
        subject: subject,
        body: emailData.payload.body.data,
        messageId: emailData.id,
        threadId: emailData.threadId,
        historyId: emailData.historyId,
        labelIds: emailData.labelIds,
        sentAt: DateHelper.getCurrentUnixTime(),
        status: 'SCHEDULE',
        deletedAt: BigInt(0),
        integrationId: gmailIntegrationId,
        trackingId: trackingId,
      },
    });
  }

  private async refreshAccessToken(
    refreshToken: string,
    gmailIntegrationId: string,
  ): Promise<string> {
    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          refresh_token: refreshToken,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          grant_type: 'refresh_token',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const { access_token } = response.data;

      // Retrieve existing data
      const existingIntegration = await this.prisma.integration.findUnique({
        where: { id: gmailIntegrationId },
        select: { data: true }, // Retrieve only the data field
      });

      if (existingIntegration) {
        const updatedData = {
          // @ts-ignore
          ...existingIntegration.data, // Preserve all existing fields
          accessToken: access_token, // Update the accessToken field
        };

        // Update only the accessToken in the data field
        await this.prisma.integration.update({
          where: { id: gmailIntegrationId },
          data: {
            data: updatedData,
          },
        });
      }

      return access_token;
    } catch (error) {
      this.logger.error('Error refreshing access token:', error.message);
      throw new HttpException(
        'Failed to refresh access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async handleError(
    error: any,
    refreshToken: string,
    gmailIntegrationId: string,
    to: string[],
    cc: string[],
    bcc: string[],
    subject: string,
    body: string,
  ) {
    if (error.response?.status === 401) {
      this.logger.log('Access token invalid, refreshing token...');
      const newAccessToken = await this.refreshAccessToken(
        refreshToken,
        gmailIntegrationId,
      );
      this.logger.log(
        `New access token obtained ${newAccessToken}, retrying email send...`,
      );
      await this.sendMail({
        to,
        cc,
        bcc,
        subject,
        body,
        refreshToken,
        accessToken: newAccessToken,
        gmailIntegrationId,
      });
    } else {
      this.logger.error('Error sending email:', error.message);
      throw error;
    }
  }

  /* PRIVATE METHODS TO PERFORM SEND MAIL ACTION ENDS */
}
