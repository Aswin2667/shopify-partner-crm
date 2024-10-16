import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import prisma from 'src/utils/PrismaService';
import { DateHelper } from '@org/utils';
import { v4 as uuidv4 } from 'uuid';
import { IntegrationManager } from '@org/integrations';
@Injectable()
export class EmailCronService {
  private readonly logger = new Logger(EmailCronService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly IntegrationManager: IntegrationManager,
  ) {}

  @Cron('* * * * *')
  async emailSender() {
    this.logger.log('Cron job running every minute');

    try {
      // Fetch emails from the queue that are scheduled to be sent
      const emailsToSend = await prisma.emailQueue.findMany({
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
      console.log(emailsToSend)
      for (const emailQueueEntry of emailsToSend) {
        try {
          const { email } = emailQueueEntry;
          const trackingId = uuidv4();
          email.body = getTrackingImage(email.body, trackingId);

          // Sending email via Integration Manager
          // console.log(email);
          const res = await this.IntegrationManager.performIntegrationAction(
            email.source as any,
            'SEND_MAIL',
            email,
          );
          await prisma.email.updateMany({
            where: { id: emailQueueEntry.emailId },
            data: {
              status: 'SEND',
              trackingId,
              sentAt: DateHelper.getCurrentUnixTime(),
            },
          }),
            await prisma.emailQueue.deleteMany({
              where: { id: emailQueueEntry.id },
            });

          res &&
            this.logger.log(
              `Email ${emailQueueEntry.emailId} sent successfully`,
            );
        } catch (error) {
          this.logger.error(
            `Failed to send email ${emailQueueEntry.emailId}`,
            error.stack,
          );

          if (emailQueueEntry.retryCount < this.MAX_RETRIES) {
            // Increment retry count and set status to PENDING
            await prisma.emailQueue.update({
              where: { id: emailQueueEntry.id },
              data: {
                status: 'PENDING',
                retryCount: emailQueueEntry.retryCount + 1,
              },
            });

            this.logger.log(
              `Retrying email ${emailQueueEntry.emailId}, attempt ${emailQueueEntry.retryCount + 1}`,
            );
          } else {
            // After max retries, update email status to FAILED and remove from queue
            await prisma.email.updateMany({
              where: { id: emailQueueEntry.emailId },
              data: { status: 'FAILED' },
            }),
              await prisma.emailQueue.deleteMany({
                where: { id: emailQueueEntry.id },
              }),
              this.logger.error(
                `Email ${emailQueueEntry.emailId} failed after ${this.MAX_RETRIES} attempts`,
              );
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing email queue', error.stack);
    }
  }
}
const getTrackingImage = (body: string, id: string): string => {
  const bodyWithTrackingImage =
    body +
    `<img src="${process.env.TRACKER_BASE_URL}?id=${id}" style="display:none;" width="1" height="1" alt="" />`;
  return bodyWithTrackingImage;
};
