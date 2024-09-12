import { Injectable } from '@nestjs/common';
import { SendGridIntegration } from './sendgrid-integration.interface';
import { BaseIntegrationService } from 'src/base/base-integration.service';
import {
  INTEGRATION_SINGULARITY,
  IntegrationCategory,
  IntegrationData,
  IntegrationSharingType,
  IntegrationType,
} from 'src/types';
import { Prisma, PrismaService } from '@org/data-source';
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
    if (action === 'SEND_MAIL') {
      return await this.sendMail(params);
    } else {
      throw new Error('Invalid action');
    }
  }

  //  private methods for to perform the action
  private async sendMail(emailData: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    gmailIntegrationId: string;
  }) {
    try {
      const { to, cc, bcc, subject, body, gmailIntegrationId } = emailData;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg: MailDataRequired | MailDataRequired[] = {
        to: to, // Change to your recipient
        cc: cc,
        bcc: bcc,
        from: {
          email: 'db1582002@gmail.com',
          name: 'Dinesh Balan S',
        }, // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error);
          throw new Error(`Failed to send email: ${error.message}`);
        });

      // if (response.status === 200) {
      //   return { success: true, error: null };
      // } else {
      //   throw new Error(`Failed to send email: ${response.statusText}`);
      // }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
