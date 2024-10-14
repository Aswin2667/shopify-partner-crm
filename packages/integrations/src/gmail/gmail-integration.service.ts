import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { BaseIntegrationService } from '../base/base-integration.service';
import {
  INTEGRATION_SINGULARITY,
  IntegrationData,
  IntegrationSharingType,
  IntegrationType,
  IntegrationCategory,
  MailAction,
} from '../types';
import axios from 'axios';
import { google } from 'googleapis';
import { ConnectConfig, GmailAction, GmailIntegrationData } from './types';
import { Email, Prisma, PrismaService } from '@org/data-source';
import { DateHelper } from '@org/utils';
import { getTrackingImage } from 'src/helper';
import { throwError } from 'rxjs';
import { SendGridIntegrationService } from 'src/sendgrid';

@Injectable()
export class GmailIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'Gmail',
    description:
      'Seamlessly integrate your inbox with our CRM. Track conversations, send emails, and manage customer relationships—all from one platform.',
    type: IntegrationType.GMAIL,
    singular: INTEGRATION_SINGULARITY.GMAIL,
    category: IntegrationCategory.MAIL_SERVICE,
    sharedType: IntegrationSharingType.PRIVATE,
    logo: 'https://www.gstatic.com/images/branding/product/1x/gmail_512dp.png',
    authType: 'OAUTH2',
  };

  private oauth2Client;
  private readonly tokenInfoUrl =
    'https://www.googleapis.com/oauth2/v3/tokeninfo';
  private readonly logger = new Logger(GmailIntegrationService.name);

  constructor(private readonly prisma: PrismaService) {
    super();
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID ||
        '132861762148-dhkdcu4kmkv3p3drdr6n1l3m748mbfk1.apps.googleusercontent.com',
      process.env.GOOGLE_CLIENT_SECRET || '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',
      process.env.REDIRECT_URI ||
        'https://shopcrm-server-5e5331b6be39.herokuapp.com/auth/google/callback',
    );
  }

  getIntegrationData(): IntegrationData {
    return this.data;
  }

  async connect(config: ConnectConfig): Promise<any> {
    const { code, redirect_url, orgMemberId } = config;
    const organizationId = redirect_url.split('/').filter(Boolean)[2];
    try {
      // Exchange code for access token and refresh token
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id:
            process.env.GOOGLE_CLIENT_ID ||
            '132861762148-dhkdcu4kmkv3p3drdr6n1l3m748mbfk1.apps.googleusercontent.com',
          client_secret:
            process.env.GOOGLE_CLIENT_SECRET ||
            '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',
          redirect_uri:
            process.env.REDIRECT_URI ||
            'https://shopcrm-server-5e5331b6be39.herokuapp.com/auth/google/callback',
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
        category: IntegrationCategory.MAIL_SERVICE,
        sharedType: IntegrationSharingType.PRIVATE,
      };

      const integrationExists = await this.prisma.integration.findFirst({
        where: {
          organizationId,
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
        const integration = await this.prisma.integration.create({
          data: {
            name: `${data.name}'s Gmail Integration`,
            description: `Integration with Gmail for ${data.email}`,
            type: data.type,
            isSingular: data.isSingular,
            organizationId: data.organizationId,
            orgMemberId: orgMemberId,
            sharedType: data.sharedType,
            data: {
              googleId: data.googleId,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              email: data.email,
              name: data.name,
            } as unknown as Prisma.JsonValue,
            category: data.category,
            createdAt: DateHelper.getCurrentUnixTime(),
            updatedAt: DateHelper.getCurrentUnixTime(),
            deletedAt: BigInt(0), // Assuming 0 means not deleted
          },
        });
        await this.prisma.mailServiceFromEmail.create({
          data: {
            integrationId: integration.id,
            fromEmail: data.email,
            fromName: data.name,
            type: data.type,
            createdAt: DateHelper.getCurrentUnixTime(),
            organizationId: data.organizationId,
          },
        });
        return integration;
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
    if (action === MailAction.SEND_MAIL) {
      return await this.sendMail(params);
    } else if (action === MailAction.SCHEDULE_MAIL) {
      return await this.scheduleMail(params);
    } else if (action === MailAction.RESPOND_MAIL) {
      return await this.respondMail(params);
    } else if (action === MailAction.GET_THREAD) {
      return await this.getThread(params);
    } else if (action === MailAction.REPLY_MAIL) {
      return await this.replyMail(params);
    } else if (action === MailAction.FORWARD_MAIL) {
      return await this.forwardMail(params);
    } else if (action === 'TEST') {
      return await this.test(params);
    } else {
      throw new Error('Invalid action');
    }
  }

  /* PRIVATE METHODS TO PERFORM SEND MAIL ACTION STARTS */

  private async test(params: any) {
    console.log(params);
  }

  private async sendMail(emailData: Email) {
    const {
      from,
      to,
      cc,
      bcc,
      subject,
      body,
      replyTo,
      integrationId,
      contactId,
      organizationId,
      leadId,
    } = emailData;
    const integration = await this.getIntegrationById(integrationId);

    const { accessToken, refreshToken } = integration.data as {
      accessToken: string;
      refreshToken: string;
    };

    try {
      await this.verifyToken(accessToken);
      this.oauth2Client.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      const customMessageId = `<${this.generateCustomMessageId()}>`;

      // TODO: add from
      const headers = this.buildEmailHeaders(
        from,
        to,
        cc,
        bcc,
        subject,
        customMessageId,
        replyTo,
      );

      console.log('contactId: ', contactId);
      console.log(body);
      console.log('-----------------------');

      const bodyWithShortCodes = await this.replaceShortCodes(
        body,
        contactId,
        leadId,
      );

      // Build the email body with footer if contactId is provided
      const bodyWithFooter = await this.buildBodyWithFooter(
        bodyWithShortCodes,
        contactId,
        organizationId,
      );

      console.log(bodyWithFooter);

      const message = `${headers}\r\n\r\n${bodyWithFooter}`;
      const encodedMessage = this.encodeMessage(message);

      console.log(message);

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

      const updatedMailResponse = await this.updateEmailInDatabase(
        emailData,
        response.data,
        bodyWithFooter,
      );
      return updatedMailResponse;
      return { message: 'Mail sent successfully' };
    } catch (error) {
      await this.handleError(error, refreshToken, integrationId, emailData);
    }
  }

  private async scheduleMail(mailData: {
    from: { name: string; email: string };
    to: string[];
    cc: string[];
    bcc: string[];
    replyTo: string;
    subject: string;
    body: string;
    userId: string;
    integrationId: string;
    contactId: string;
    organizationId: string;
    leadId: string;
    scheduledAt: bigint | number;
    source: IntegrationType;
  }) {
    try {
      const {
        from,
        to,
        cc,
        bcc,
        subject,
        body,
        integrationId,
        contactId,
        userId,
        organizationId,
        leadId,
        scheduledAt,
        source,
        replyTo,
      } = mailData;
      const mailSavedresponse = await this.prisma.email.create({
        data: {
          from,
          to,
          cc,
          bcc,
          subject,
          leadId,
          body,
          integrationId,
          contactId,
          organizationId,
          userId,
          source,
          replyTo,
        },
      });
      if (mailSavedresponse.id) {
        const mailQueueResponse = await this.prisma.emailQueue.create({
          data: {
            emailId: mailSavedresponse.id,
            scheduledAt,
            status: 'PENDING',
          },
        });
        this.logger.log('Mail scheduled successfully');
        console.log(mailSavedresponse);
        return mailQueueResponse;
      }
      throw new Error('Failed to schedule email');
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  private async replyMail(replyData: {
    integrationId: string;
    threadId: string;
    messageId: string;
    recipient: string;
    cc: string[];
    bcc: string[];
    replyBody: string;
    originalSubject: string;
  }) {
    const {
      integrationId,
      threadId,
      messageId,
      recipient,
      cc,
      bcc,
      replyBody,
      originalSubject,
    } = replyData;
    const integration = await this.getIntegrationById(integrationId);

    const { accessToken, refreshToken } = integration.data as {
      accessToken: string;
      refreshToken: string;
    };

    try {
      await this.verifyToken(accessToken);
      this.oauth2Client.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      const headers = this.createEncodedHeader({
        to: recipient,
        cc,
        bcc,
        subject: originalSubject, // Can change this if needed
        inReplyTo: messageId, // Reference to the original message ID
        references: messageId, // Keep the reference to the original message
      });

      const message = `${headers}\r\n\r\n${replyBody}`;
      const encodedMessage = this.encodeMessage(message);

      console.log(headers);
      console.log(message);
      console.log(encodedMessage);

      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
          threadId: threadId, // Associate reply with the thread
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logger.log('Access token invalid, refreshing token...');
        const newAccessToken = await this.refreshAccessToken(
          refreshToken,
          integrationId,
        );
        this.logger.log(
          `New access token obtained ${newAccessToken}, retrying email send...`,
        );
        await this.replyMail(replyData);
      } else {
        this.logger.error('Error sending email:', error.message);
        throw error;
      }
    }
  }

  private async forwardMail(forwardData: {
    integrationId: string;
    threadId: string;
    messageId: string; // ID of the email being forwarded
    recipient: string[]; // Recipient of the forwarded email
    cc: string[];
    bcc: string[];
    originalSubject: string;
    forwardBody: string; // Optional message body added by the user when forwarding
  }) {
    const {
      integrationId,
      messageId,
      threadId,
      recipient,
      bcc,
      cc,
      forwardBody,
      originalSubject,
    } = forwardData;
    const integration = await this.getIntegrationById(integrationId);

    const { accessToken, refreshToken } = integration.data as {
      accessToken: string;
      refreshToken: string;
    };

    try {
      await this.verifyToken(accessToken);
      this.oauth2Client.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      // Fetch the original message to forward
      const originalMessage = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
      });

      const originalMessageData = originalMessage.data;

      // Build the headers for the forwarded message
      const headers = this.createEncodedHeader({
        to: recipient,
        cc,
        bcc,
        subject: originalSubject, // Can change this if needed
        inReplyTo: messageId, // Reference to the original message ID
        references: messageId, // Keep the reference to the original message
      });

      // Construct the forward message with headers, original message, and any additional body content
      const forwardMessage = `${headers}\r\n\r\n${forwardBody || ''}\r\n\r\n---------- Forwarded message ----------\r\n${originalMessageData.snippet}`;

      // Encode the message for sending
      const encodedMessage = this.encodeMessage(forwardMessage);

      // Send the forwarded email
      const forwardResponse = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
          threadId: threadId,
        },
      });

      this.logger.log('Email forwarded successfully');

      return forwardResponse.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logger.log('Access token invalid, refreshing token...');
        const newAccessToken = await this.refreshAccessToken(
          refreshToken,
          integrationId,
        );
        this.logger.log(
          `New access token obtained ${newAccessToken}, retrying email forward...`,
        );
        await this.forwardMail(forwardData); // Retry forwarding email
      } else {
        this.logger.error('Error forwarding email:', error.message);
        throw error;
      }
    }
  }

  private async respondMail(actionData: {
    integrationId: string;
    threadId: string;
    messageId: string; // Message ID for reply or forward
    recipient: string[]; // To field for recipient(s)
    cc?: string[]; // Optional CC field
    bcc?: string[]; // Optional BCC field
    subject: string; // Subject of the email
    body: string; // Body content for reply or forward
    action: 'REPLY' | 'FORWARD'; // Action type to differentiate between reply or forward
    actualMessageId?: string;
  }) {
    const {
      integrationId,
      threadId,
      messageId,
      recipient,
      cc = [],
      bcc = [],
      body,
      subject,
      action,
      actualMessageId,
    } = actionData;
    console.log(actionData);

    const integration = await this.getIntegrationById(integrationId);
    const { accessToken, refreshToken } = integration.data as {
      accessToken: string;
      refreshToken: string;
    };

    try {
      await this.verifyToken(accessToken);
      this.oauth2Client.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      let headers;
      let messageBody = body;

      if (action === 'FORWARD') {
        // Fetch the original message if forwarding
        const originalMessage = await gmail.users.messages.get({
          userId: 'me',
          id: actualMessageId,
        });

        const originalMessageData = originalMessage.data;

        // Add the forwarded message snippet
        messageBody += `\r\n\r\n---------- Forwarded message ----------\r\n${originalMessageData.snippet}`;

        headers = this.createEncodedHeader({
          to: recipient,
          cc,
          bcc,
          subject: `Fwd: ${subject}`, // Modify subject for forwarding
          inReplyTo: messageId,
          references: messageId,
        });
      } else {
        // For reply, we add reply-specific headers
        headers = this.createEncodedHeader({
          to: recipient,
          cc,
          bcc,
          subject, // Keep the original subject for reply
          inReplyTo: messageId, // Important for threading
          references: messageId, // Keep reference to the original message
        });
      }

      // Construct the final email message with headers
      const fullMessage = `${headers}\r\n\r\n${messageBody}`;
      const encodedMessage = this.encodeMessage(fullMessage);

      // Send the message
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
          threadId: threadId, // Associate the message with the thread
        },
      });

      this.logger.log(
        `${action.charAt(0).toUpperCase() + action.slice(1)} email successfully`,
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logger.log('Access token invalid, refreshing token...');
        const newAccessToken = await this.refreshAccessToken(
          refreshToken,
          integrationId,
        );
        this.logger.log(
          `New access token obtained ${newAccessToken}, retrying email ${action}...`,
        );

        // Retry the action with new access token
        return this.respondMail(actionData);
      } else {
        this.logger.error(`Error during ${action}:`, error.message);
        throw error;
      }
    }
  }

  /**
   * Builds the email body with an unsubscribe footer if contactId is provided.
   * @param body The original email body.
   * @param contactId The contact ID used to generate the unsubscribe link.
   * @param organizationId The organization ID to fetch the unsubscribe message and anchor text.
   * @returns The email body appended with the unsubscribe footer.
   */
  private async buildBodyWithFooter(
    body: string,
    contactId: string | undefined,
    organizationId: string,
  ): Promise<string> {
    if (!contactId) {
      return body;
    }

    // Fetch the unsubscribe link details based on organizationId
    const unsubscribeLink = await this.prisma.unsubscribeLink.findFirst({
      where: {
        organizationId: organizationId,
      },
    });

    const NEW_LINE = '<p><br></p>';
    //  https://dinesh.server.ngrok.dev/contacts/1/unsubscribe

    const FOOTER = `
      <footer style="text-align: center; padding: 20px; font-size: 12px; color: #888;">
        <p>
          ${unsubscribeLink?.message || 'If you no longer wish to receive these emails, you can '}
          <a href="https://shopify-crm-prod-e605497309dc.herokuapp.com/unsubscribe/${contactId}" target="_blank">
            ${unsubscribeLink?.anchorText || 'unsubscribe'}
          </a>.
        </p>
      </footer>
    `;

    return `${body}${FOOTER}`;
  }

  private async replaceShortCodes(body: string, contactId, leadId) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
      },
    });
    const lead = await this.prisma.lead.findFirst({
      where: {
        id: leadId,
      },
    });

    // Set fallback values in case contact or lead is not found
    const contactFirstName = contact ? contact.firstName : '-';
    const contactLastName = contact ? contact.lastName : '-';
    const contactEmail = contact ? contact.email : '-';
    const shopifyDomain = lead ? lead.shopifyDomain : '-';

    // Replace shortcodes with actual values or fallback values
    return body
      .replace(/{{name}}/g, `${contactFirstName} ${contactLastName}`)
      .replace(/{{email}}/g, contactEmail)
      .replace(/{{shopify_domain}}/g, shopifyDomain);
  }

  private createEncodedHeader({ to, cc, bcc, subject, inReplyTo, references }) {
    return [
      `To: ${to.join(', ')}`,
      cc.length ? `Cc: ${cc.join(', ')}` : '',
      bcc.length ? `Bcc: ${bcc.join(', ')}` : '',
      `Subject: ${subject}`,
      `In-Reply-To: ${inReplyTo}`, // Critical for threading
      `References: ${references}`, // Critical for threading
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
    ]
      .filter(Boolean)
      .join('\r\n');
  }

  private async getThread({
    threadId,
    integrationId,
  }: {
    threadId: string;
    integrationId: string;
  }) {
    const integration = await this.getIntegrationById(integrationId);

    const { accessToken, refreshToken } = integration.data as {
      accessToken: string;
      refreshToken: string;
    };
    try {
      await this.verifyToken(accessToken);

      const response = await this.fetchThreadDetails(threadId, accessToken);

      console.log(response.data);

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logger.log('Access token invalid, refreshing token...');
        const newAccessToken = await this.refreshAccessToken(
          refreshToken,
          integrationId,
        );
        this.logger.log(
          `New access token obtained ${newAccessToken}, retrying email send...`,
        );
        await this.getThread({ threadId, integrationId });
      } else {
        this.logger.error('Error sending email:', error.message);
        throw error;
      }
    }
  }

  private generateCustomMessageId() {
    return `${Math.random().toString(36).substr(2, 9)}@mail.gmail.com`;
  }

  private buildEmailHeaders(
    from,
    to,
    cc,
    bcc,
    subject,
    customMessageId?,
    replyTo?,
  ) {
    return [
      `From: ${from.name} <${from.email}>`,
      // `From: "Dinesh Balan S" <dineshbalan@gmail.com>`,
      `To: ${to.join(', ')}`,
      cc.length ? `Cc: ${cc.join(', ')}` : '',
      bcc.length ? `Bcc: ${bcc.join(', ')}` : '',
      `Subject: ${subject}`,
      replyTo ? `Reply-To: ${replyTo}` : '',
      customMessageId && `X-Message-ID: ${customMessageId}`,
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

  private async fetchThreadDetails(threadId: string, accessToken: string) {
    return axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  private async updateEmailInDatabase(email: Email, emailData, body) {
    const updatedEmail = await this.prisma.email.update({
      where: {
        id: email.id,
      },
      data: {
        messageId: emailData.id,
        threadId: emailData.threadId,
        historyId: emailData.historyId,
        labelIds: emailData.labelIds,
        sentAt: DateHelper.getCurrentUnixTime(),
        status: 'SEND',
        body: body,
      },
      include: {
        user: true,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        type: 'MAIL',
        data: {
          message: 'Email sent successfully via Gmail',
          data: updatedEmail as any,
        },
        leadId: email.leadId,
        orgId: email.organizationId,
        userId: email.userId ?? '',
        createdAt: DateHelper.getCurrentUnixTime(),
        updatedAt: 0,
        deletedAt: 0,
      },
    });

    return updatedEmail;
  }

  private async refreshAccessToken(
    refreshToken: string,
    integrationId: string,
  ): Promise<string> {
    try {
      console.log('refreshToken :', refreshToken);
      console.log('integrationId :', integrationId);

      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          refresh_token: refreshToken,
          client_id:
            process.env.GOOGLE_CLIENT_ID ||
            '132861762148-dhkdcu4kmkv3p3drdr6n1l3m748mbfk1.apps.googleusercontent.com',
          client_secret:
            process.env.GOOGLE_CLIENT_SECRET ||
            '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',
          grant_type: 'refresh_token',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log('response.data:', response.data);

      const { access_token } = response.data;

      // Retrieve existing data
      const existingIntegration = await this.prisma.integration.findUnique({
        where: { id: integrationId },
        select: { data: true }, // Retrieve only the data field
      });

      console.log('existingIntegration: ', existingIntegration);

      if (existingIntegration) {
        const updatedData = {
          // @ts-ignore
          ...existingIntegration.data, // Preserve all existing fields
          accessToken: access_token, // Update the accessToken field
        };

        // Update only the accessToken in the data field
        await this.prisma.integration.update({
          where: { id: integrationId },
          data: {
            data: updatedData,
          },
        });
      }

      return access_token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error refreshing access token:',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
      throw new HttpException(
        'Failed to refresh access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async handleError(
    error: any,
    refreshToken: string,
    integrationId: string,
    emailData: Email,
  ) {
    if (error.response?.status === 401) {
      this.logger.log('Access token invalid, refreshing token...');
      const newAccessToken = await this.refreshAccessToken(
        refreshToken,
        integrationId,
      );
      this.logger.log(
        `New access token obtained ${newAccessToken}, retrying email send...`,
      );
      await this.sendMail(emailData);
    } else {
      this.logger.error('Error sending email:', error.message);
      throw error;
    }
  }

  private async getIntegrationById(integrationId: string) {
    try {
      const integration = await this.prisma.integration.findUnique({
        where: {
          id: integrationId,
        },
      });

      if (!integration) {
        throw new Error(`Integration With Id ${integrationId} Not Found`);
      }

      return integration;
    } catch (error) {
      throw error;
    }
  }

  /* PRIVATE METHODS TO PERFORM SEND MAIL ACTION ENDS */
}
