import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { google } from 'googleapis';
import { PrismaService } from 'src/config/prisma.service';
import * as gmailApiSync from 'gmail-api-sync';
import { DateHelper } from '@org/utils';

@Injectable()
export class MailService {
  private oauth2Client;
  private readonly tokenInfoUrl =
    'https://www.googleapis.com/oauth2/v3/tokeninfo';
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly prisma: PrismaService) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:8080/auth/google/callback',
    );
    gmailApiSync.setClientSecretsFile('../../client_secrets.json');
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
      console.log(gmailIntegrationId);
      await this.prisma.integration.update({
        where: { id: gmailIntegrationId },
        data: {
          data: {
            accessToken: access_token,
          },
        },
      });

      return access_token;
    } catch (error) {
      this.logger.error('Error refreshing access token:', error.message);
      throw new HttpException(
        'Failed to refresh access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async getMailList(integrationId: string): Promise<any[]> {
    return this.prisma.email.findMany({
      where: { integrationId },
      orderBy: { sentAt: 'desc' },
    });
  }

  async getMails(integrationId: string): Promise<any[]> {
    return this.prisma.email.findMany({
      where: { integrationId },
      //   include: { replies: true },
    });
  }

  async sendMail(
    to: string[],
    cc: string[] = [],
    bcc: string[] = [],
    subject: string,
    body: string,
    refreshToken: string,
    accessToken: string,
    gmailIntegrationId: string,
  ) {
    try {
      await this.verifyToken(accessToken);
      this.oauth2Client.setCredentials({ access_token: accessToken });
  
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  
      const customMessageId = `<${this.generateCustomMessageId()}>`;
  
      const headers = this.buildEmailHeaders(to, cc, bcc, subject, customMessageId);
      const message = `${headers}\r\n\r\n${body}`;
      const encodedMessage = this.encodeMessage(message);
  
      const mailResponse = await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      });
  
      this.handleGmailResponse(mailResponse);
  
      const response = await this.fetchEmailDetails(mailResponse.data.id, accessToken);
  
      await this.storeEmailInDatabase(response.data, to, cc, bcc, subject, body, gmailIntegrationId);
  
      this.logger.log('Mail sent successfully');
    } catch (error) {
      await this.handleError(error, refreshToken, gmailIntegrationId, to, cc, bcc, subject, body);
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
  
  private async storeEmailInDatabase(emailData, to, cc, bcc, subject, body, gmailIntegrationId) {
    await this.prisma.email.create({
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
        deletedAt: BigInt(0),
        integrationId: gmailIntegrationId,
      },
    });
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
      await this.sendMail(
        to,
        cc,
        bcc,
        subject,
        body,
        refreshToken,
        newAccessToken,
        gmailIntegrationId,
      );
    } else {
      this.logger.error('Error sending email:', error.message);
      throw error;
    }
  }
  
  private handleGmailResponse(mailResponse: any) {
    if (mailResponse.statusText !== 'OK') {
      throw new Error(mailResponse.statusText);
    }
  }
  

  async verifyToken(accessToken: string): Promise<any> {
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

  //   async startSync(integrationId: string) {
  //     try {
  //       const user = await this.prisma.user.findUnique({ where: { id: integrationId } });
  //     //   const syncState = await this.prisma.syncState.findUnique({ where: { integrationId } });

  //       if (!user) {
  //         throw new Error('User not found');
  //       }

  //       // Create an OAuth2 client with the user's tokens
  //       const oauth2Client = new google.auth.OAuth2(
  //         process.env.GOOGLE_CLIENT_ID,
  //         process.env.GOOGLE_CLIENT_SECRET,
  //         'http://localhost:8080/auth/google/callback',
  //       );

  //       oauth2Client.setCredentials({
  //         access_token: user.accessToken,
  //         refresh_token: user.refreshToken,
  //       });

  //       // Define the callback for handling new messages
  //       const handleNewMessages = async (err: Error, response: any) => {
  //         if (err) {
  //           this.logger.error('Error syncing messages:', err);
  //           return;
  //         }

  //         const messages = response.emails || [];

  //         for (const message of messages) {
  //           const { id, historyId, raw, subject, from, to, date, threadId } = message;

  //           try {
  //             // Process and store messages
  //             const existingEmail = await this.prisma.email.findUnique({ where: { messageId: id } });

  //             if (existingEmail) {
  //               // Update existing email
  //               await this.prisma.email.update({
  //                 where: { messageId: id },
  //                 data: { updatedAt: new Date() },
  //               });
  //             } else {
  //               // Find parent email if replying to an existing email
  //               const parentId = from
  //                 ? (await this.prisma.email.findUnique({ where: { messageId: from } }))?.id
  //                 : null;

  //               // Create new email
  //               await this.prisma.email.create({
  //                 data: {
  //                   integrationId: integrationId,
  //                   to,
  //                   subject,
  //                   body: raw,  // Assuming raw contains the message body
  //                   responseId: id,
  //                   messageId: id,
  //                   parentId,
  //                   threadId,
  //                   createdAt: new Date(),  // Set creation date
  //                   updatedAt: new Date(),  // Set update date
  //                 },
  //               });
  //             }
  //           } catch (error) {
  //             this.logger.error(`Error processing message ${id}:`, error);
  //           }
  //         }

  //         // Update sync state with the latest historyId
  //         await this.prisma.syncState.upsert({
  //           where: { integrationId },
  //           update: { historyId: response.historyId },
  //           create: { integrationId, historyId: response.historyId },
  //         });
  //       };

  //       if (!syncState || !syncState.historyId) {
  //         // Initial full sync to get historyId
  //         this.logger.log('Performing initial full sync to obtain historyId...');
  //         gmailApiSync.syncMessages(oauth2Client, {}, handleNewMessages);
  //       } else {
  //         // Incremental sync using stored historyId
  //         this.logger.log('Performing incremental sync...');
  //         gmailApiSync.syncMessages(oauth2Client, { historyId: syncState.historyId }, handleNewMessages);
  //       }

  //       // Start syncing messages
  //       // gmailApiSync.syncMessages(oauth2Client, { historyId: syncState?.historyId || '' }, handleNewMessages);
  //     } catch (err) {
  //       this.logger.error('Error starting sync:', err);
  //     }
  //   }
}
