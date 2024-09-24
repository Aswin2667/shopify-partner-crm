import { Process, Processor } from '@nestjs/bull';
import { PrismaService } from '@org/data-source';
import { DateHelper } from '@org/utils';
import { Job } from 'bull';

@Processor('email-tracking-queue')
export class EmailOpenTrackingProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('email-opened')
  async handleEmailOpenedEvent(job: Job) {
    const { trackingId, openedAt } = job.data;

    console.log(`Email opened with ID: ${trackingId} at ${openedAt}`);

    try {
      await this.prisma.email.updateMany({
        where: {
          trackingId: trackingId,
        },
        data: {
          isOpened: true,
          openedAt: DateHelper.getCurrentUnixTime(),
        },
      });

      console.log(`Email with tracking ID ${trackingId} marked as opened`);
    } catch (error) {
      console.error(`Failed to update email: ${error.message}`);
    }
  }
}
