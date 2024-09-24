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
    subject: string;
    body: string;
    integrationId: string;
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
        organizationId,
        leadId,
        scheduledAt,
        source,
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
          organizationId,
          source,
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
      const { from, to, cc, bcc, subject, body, integrationId } = emailData;

      const integration = await this.getIntegrationById(integrationId);

      const { apiKey } = integration.data as { apiKey: string };
      const sender = from as unknown as {
        email: string;
        name: string;
      };

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
        html: body,
      };

      sgMail
        .send(msg)
        .then((res: any) => {
          console.log(res);
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error);
          throw new Error(`Failed to send email: ${error.message}`);
        });
    } catch (error) {
      return { success: false, error: error.message };
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
