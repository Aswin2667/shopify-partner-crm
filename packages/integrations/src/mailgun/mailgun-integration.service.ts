import { Injectable, Logger } from '@nestjs/common';
import { MailgunIntegration } from './mailgun-integration.interface';
import { BaseIntegrationService } from 'src/base/base-integration.service';
import {
  INTEGRATION_SINGULARITY,
  IntegrationCategory,
  IntegrationData,
  IntegrationSharingType,
  IntegrationType,
  MailAction,
} from 'src/types';
import { Email, Prisma, PrismaService } from '@org/data-source';
import { validateIntegration } from 'src/validation';
import { DateHelper } from '@org/utils';
import axios from 'axios';
import MailGun from 'mailgun.js';
import FormData from 'form-data';

@Injectable()
export class MailgunIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'Mailgun',
    description:
      'Supercharge your email campaigns with Mailgun. Automate, personalize, and track every email to engage your audience like never before.',
    type: IntegrationType.MAIL_GUN,
    singular: INTEGRATION_SINGULARITY.MAIL_GUN,
    category: IntegrationCategory.MAIL_SERVICE,
    sharedType: IntegrationSharingType.PUBLIC,
    logo: 'https://seeklogo.com/images/M/mailgun-logo-5388F66106-seeklogo.com.png',
    authType: 'CREDENTIALS',
  };

  private readonly logger = new Logger(MailgunIntegrationService.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  getIntegrationData(): IntegrationData {
    return this.data;
  }

  async connect(config: any): Promise<any> {
    try {
      const isMailGunIntegartionExists =
        await this.prisma.integration.findFirst({
          where: {
            type: config.type,
            isSingular: INTEGRATION_SINGULARITY[config.type],
            organizationId: config.organizationId,
          },
        });

      if (isMailGunIntegartionExists) {
        throw new Error('MailGun Integration already exits in Database');
      }

      const validationResult = validateIntegration(config.type, {
        /* Integration Object */
      });
      console.log(validationResult);

      const mailGunIntergration = await this.prisma.integration.create({
        data: {
          name: config.name,
          description: config.description,
          type: config.type,
          isSingular: INTEGRATION_SINGULARITY[config.type],
          category: IntegrationCategory.MAIL_SERVICE,
          organizationId: config.organizationId,
          sharedType: IntegrationSharingType.PUBLIC,
          data: {
            apiKey: config.data.apiKey,
            domain: config.data.domain,
          } as unknown as Prisma.JsonValue,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: DateHelper.getCurrentUnixTime(),
          deletedAt: BigInt(0), // Assuming 0 means not deleted
        },
      });
      console.log(
        'mailGunIntergration created successfully : ' + mailGunIntergration,
      );
      return mailGunIntergration;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async performAction(action: string, params: any): Promise<any> {
    if (action === MailAction.SEND_MAIL) {
      return await this.sendMail(params);
    }
    if (action === MailAction.SCHEDULE_MAIL) {
      return await this.scheduleMail(params);
    } else {
      throw new Error('Invalid action');
    }
  }

  //  private methods for to perform the action

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

  private async sendMail(emailData: Email) {
    try {
      const {
        from,
        to,
        cc,
        bcc,
        subject,
        body,
        integrationId,
        replyTo,
        contactId,
        organizationId,
        leadId,
      } = emailData;

      const integration = await this.getIntegrationById(integrationId);

      const { apiKey, domain } = integration.data as {
        apiKey: string;
        domain: string;
      };
      const sender = from as unknown as {
        email: string;
        name: string;
      };

      console.log(apiKey);
      console.log(domain);
      console.log(emailData);

      if (!apiKey || !domain) {
        throw new Error('Mailgun API key or domain is not set');
      }

      const bodyWithShortCodes = await this.replaceShortCodes(
        body,
        contactId,
        leadId,
      );

      const bodyWithFooter = await this.buildBodyWithFooter(
        bodyWithShortCodes,
        contactId,
        organizationId,
      );

      const formData = new FormData();
      // mailgun@${domain}
      formData.append('from', `${sender.name} <${sender.email}>`);
      formData.append('to', to.join(', '));
      if (cc.length) formData.append('cc', cc.join(', '));
      if (bcc.length) formData.append('bcc', bcc.join(', '));
      formData.append('subject', subject);
      formData.append('html', bodyWithFooter);
      formData.append('h:Reply-To', replyTo || sender.email);

      const response = await axios.post(
        `https://api.mailgun.net/v3/${domain}/messages`,
        formData,
        {
          auth: {
            username: 'api',
            password: apiKey,
          },
        },
      );
      console.log(response.data);

      if (response.status === 200) {
        console.log('Email sent successfully');

        const updatedMailResponse = await this.updateEmailInDatabase(
          emailData,
          response.data,
          bodyWithFooter,
        );

        return {
          success: true,
          error: null,
          data: updatedMailResponse,
          message: 'Email sent successfully',
        };
      } else {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async updateEmailInDatabase(email: Email, emailData, body) {
    const updatedEmail = await this.prisma.email.update({
      where: {
        id: email.id,
      },
      data: {
        sentAt: DateHelper.getCurrentUnixTime(),
        status: 'SEND',
        body,
      },
      include: {
        user: true,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        type: 'MAIL',
        data: {
          message: 'Email sent successfully via Mailgun',
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
}
