import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@org/data-source';
import { DateHelper } from '@org/utils';
import { IntegrationManager } from '@org/integrations';
@Injectable()
export class EmailCronService {
  private readonly logger = new Logger(EmailCronService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly IntegrationManager: IntegrationManager,
  ) {}

  @Cron('*/1 * * * * *')
  async handleCron() {
    this.logger.log('Cron job running every minute');

    try {
      // Fetch emails from the queue that are scheduled to be sent
      const emailsToSend = await this.prisma.emailQueue.findMany({
        where: {
          scheduledAt: {
            lt: DateHelper.getCurrentUnixTime(),
          },
          status: 'PENDING',
        },
        include: {
          email: true,
        },
      });
      console.log(emailsToSend);
      for (const emailQueueEntry of emailsToSend) {
        try {
            this.IntegrationManager.performIntegrationAction('GMAIL' as any, 'TEST', emailQueueEntry.email);

          // Send the email logic goes here
        //   const email = await this.prisma.email.update({
        //     where: { id: emailQueueEntry.emailId },
        //     data: {
        //       status: 'SENT',
        //       sentAt: new Date() // Update sentAt with Date object
        //     },
        //   });

          this.logger.log(`Email sent successfully: ${emailQueueEntry.emailId}`);

        } catch (error) {
          this.logger.error(`Failed to send email ${emailQueueEntry.emailId}`, error.stack);

          if (emailQueueEntry.retryCount < this.MAX_RETRIES) {
            await this.prisma.emailQueue.update({
              where: { id: emailQueueEntry.id },
              data: {
                status: 'PENDING',
                retryCount: emailQueueEntry.retryCount + 1,
              },
            });
            this.logger.log(`Retrying email ${emailQueueEntry.emailId}, attempt ${emailQueueEntry.retryCount + 1}`);
          } else {
            await this.prisma.emailQueue.update({
              where: { id: emailQueueEntry.id },
              data: { status: 'FAILED' },
            });
            this.logger.error(`Email ${emailQueueEntry.emailId} failed after ${this.MAX_RETRIES} attempts`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing email queue', error.stack);
    }
  }
}
