import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { DateHelper } from '@org/utils';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@org/data-source';

@Processor('credit_events')
export class CreditEventsProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('CREDIT_EVENTS')
  async handleCreditEvents(job: Job) {
    try {
      // Process credit events
      const eventsArray = job.data;

      for (const event of eventsArray) {
        const { type, shop, occurredAt } = event;

         const existingLead = await this.prisma.lead.findFirst({
          where: {
            shopifyDomain: shop.myshopifyDomain,
          },
        });

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(JSON.stringify(event), saltOrRounds);
        const eventStr = JSON.stringify(event);

        // console.log('Hash from cron1 event consumer: ', hash);

        if (!existingLead) {
          const newLead = await this.prisma.lead.create({
            data: {
              shopifyDomain: shop.myshopifyDomain,
              shopifyStoreId: shop.id,
              integrationId: '',
              organizationId: '',
              createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
              updatedAt: 0,
              deletedAt: 0,
            },
          });

          // console.log('New Lead Created:', newLead.id);

          // Create leadActivity for the new lead
          await this.prisma.leadActivity.create({
            data: {
              leadId: newLead.id,
              data: {
                message: 'created by sync',
                string1: eventStr,
                hash: hash,
              },
              type: type,
              createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
              updatedAt: 0,
              deletedAt: 0,
            },
          });
        } else {
          // console.log('Existing lead found:', existingLead.id);

          // Create leadActivity for the existing lead
          await this.prisma.leadActivity.create({
            data: {
              leadId: existingLead.id,
              data: {
                message: 'created by sync',
                string1: eventStr,
                hash: hash,
              },
              type: type,
              createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
              updatedAt: 0,
              deletedAt: 0,
            },
          });
        }
      }
    } catch (error) {
      console.error('Failed to handle credit events:', error.message);
    }
  }
}
