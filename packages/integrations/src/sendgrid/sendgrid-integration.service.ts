import { Injectable, Logger } from '@nestjs/common';
import { SendGridIntegration } from './sendgrid-integration.interface';
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
import sgMail, { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class SendGridIntegrationService extends BaseIntegrationService<object> {
  private data: IntegrationData = {
    name: 'SendGrid',
    description:
      'Reach your customers with precision using SendGrid. From transactional emails to marketing campaigns, manage it all directly from our CRM.',
    type: IntegrationType.SEND_GRID,
    singular: INTEGRATION_SINGULARITY.SEND_GRID,
    category: IntegrationCategory.MAIL_SERVICE,
    sharedType: IntegrationSharingType.PUBLIC,
    logo: 'https://wpforms.com/wp-content/uploads/cache/integrations/4dc59b3dad493b05c625c346465cee83.png',
    authType: 'CREDENTIALS',
  };
  private readonly logger = new Logger(SendGridIntegrationService.name);
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  getIntegrationData(): IntegrationData {
    return this.data;
  }

  async connect(config: any): Promise<any> {
    try {
      const isSendGridIntegartionExists =
        await this.prisma.integration.findFirst({
          where: {
            type: config.type,
            isSingular: INTEGRATION_SINGULARITY[config.type],
            organizationId: config.organizationId,
          },
        });

      if (isSendGridIntegartionExists) {
        throw new Error('SendGrid Integration already exits in Database');
      }

      const validationResult = validateIntegration(config.type, {
        /* Integration Object */
      });
      console.log(validationResult);

      const sendGridIntergration = await this.prisma.integration.create({
        data: {
          name: config.name,
          description: config.description,
          type: config.type,
          isSingular: INTEGRATION_SINGULARITY[config.type],
          category: IntegrationCategory.MAIL_SERVICE,
          sharedType: IntegrationSharingType.PUBLIC,
          organizationId: config.organizationId,
          data: {
            apiKey: config.data.apiKey,
          } as unknown as Prisma.JsonValue,
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: DateHelper.getCurrentUnixTime(),
          deletedAt: BigInt(0), // Assuming 0 means not deleted
        },
      });
      console.log(
        'sendGridIntergration created successfully : ' + sendGridIntergration,
      );
      return sendGridIntergration;
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

      const { apiKey } = integration.data as { apiKey: string };
      const sender = from as unknown as {
        email: string;
        name: string;
      };

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

      sgMail.setApiKey(apiKey);
      const msg: MailDataRequired | MailDataRequired[] = {
        to: to, // Change to your recipient
        cc: cc,
        bcc: bcc,
        from: {
          email: sender.email,
          name: sender.name,
        }, // Change to your verified sender
        subject,
        // text: 'and easy to do anywhere, even with Node.js',
        html: bodyWithFooter,
        replyTo: replyTo || sender.email,
      };

      sgMail
        .send(msg)
        .then(async (res: any) => {
          console.log(res);
          console.log('Email sent');

          const updatedMailResponse = await this.updateEmailInDatabase(
            emailData,
            res,
            bodyWithFooter,
          );

          return {
            success: true,
            data: updatedMailResponse,
            message: 'Email sent successfully',
          };
        })
        .catch((error) => {
          console.error(error);
          throw new Error(`Failed to send email: ${error.message}`);
        });
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
          message: 'Email sent successfully via SendGrid',
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

// [
//   Response {
//     statusCode: 202,
//     body: '',
//     headers: Object [AxiosHeaders] {
//       server: 'nginx',
//       date: 'Mon, 16 Sep 2024 10:57:56 GMT',
//       'content-length': '0',
//       connection: 'keep-alive',
//       'x-message-id': 'AIkVh2ZRTaK6fH_Ljeq6Vg',
//       'access-control-allow-origin': 'https://sendgrid.api-docs.io',
//       'access-control-allow-methods': 'POST',
//       'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
//       'access-control-max-age': '600',
//       'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html',
//       'strict-transport-security': 'max-age=600; includeSubDomains'
//     }
//   },
//   ''
// ]
