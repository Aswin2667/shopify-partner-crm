import { Process, Processor } from '@nestjs/bull';
import { PrismaService } from 'src/prisma.service';
import { Job } from 'bullmq';
import { DateHelper } from '@org/utils';
import * as bcrypt from 'bcrypt';

@Processor('credit_events')
export class CreditEventsProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('APP_CREDIT_EVENTS')
  async handleAppCreditEvents(job: Job) {
    await this.processCreditEvents(job);
  }

  @Process('APP_CREDIT_EVENTS_AFTER')
  async handleAppCreditEventsAfter(job: Job) {
    await this.processCreditEvents(job);
  }

  private async processCreditEvents(job: Job) {
    try {
      const { app, events } = job.data;

      console.log('App: ', app);
      console.log('Events: ', events);

      for (const event of events) {
        const { type, shop, occurredAt } = event;
        const { appId, name, projectId, integrationId, organizationId } = app;

        // Unique event identifier for credit event processing
        const eventIdentifier = `${shop.myshopifyDomain}-${shop.id}-${occurredAt}`;
        const existingEvent = await this.prisma.leadActivity.findFirst({
          where: {
            data: {
              path: ['payload', 'shop', 'id'],
              equals: shop.id,
            },
            createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
            lead: {
              shopifyDomain: shop.myshopifyDomain,
              shopifyStoreId: shop.id,
            },
            type,
          },
        });

        if (!existingEvent) {
          // Check for an existing lead
          const existingLead = await this.prisma.lead.findFirst({
            where: {
              shopifyDomain: shop.myshopifyDomain,
              shopifyStoreId: shop.id,
              integrationId: integrationId,
            },
          });

          const saltOrRounds = 10;
          const hash = await bcrypt.hash(JSON.stringify(event), saltOrRounds);
          const eventStr = JSON.stringify(event);

          if (!existingLead) {
            const newLead = await this.prisma.lead.create({
              data: {
                shopifyDomain: shop.myshopifyDomain,
                shopifyStoreId: shop.id,
                integrationId: integrationId,
                organizationId: organizationId,
                createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                updatedAt: 0,
                deletedAt: 0,
              },
            });

            console.log('New Lead Created:', newLead.id);

            // Create leadActivity for new lead
            await this.prisma.leadActivity.create({
              data: {
                leadId: newLead.id,
                type: type,
                data: {
                  message: 'created by sync',
                  string1: eventStr,
                  hash: hash,
                },
                createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                updatedAt: 0,
                deletedAt: 0,
              },
            });
          } else {
            console.log('Existing lead found:', existingLead.id);

            const existingleadProject = await this.prisma.leadProject.findFirst({
              where: {
                leadId: existingLead.id,
                projectId,
              },
            });

            if (!existingleadProject) {
              const anotherLeadProject = await this.prisma.leadProject.create({
                data: {
                  leadId: existingLead.id,
                  projectId,
                  integrationId: integrationId,
                  createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                  updatedAt: 0,
                  deletedAt: 0,
                },
              });
              console.log('Another Lead Project: ', anotherLeadProject.id);
            }

            await this.prisma.leadActivity.create({
              data: {
                leadId: existingLead.id,
                type: type,
                data: {
                  message: 'created by sync',
                  string1: eventStr,
                  hash: hash,
                },
                createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                updatedAt: 0,
                deletedAt: 0,
              },
            });
          }
        } else {
          console.log('Duplicate event found, skipping processing.');
        }
      }
    } catch (error) {
      console.error('Error processing credit events:', error);
    }
  }
}
