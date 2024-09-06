import { Process, Processor } from '@nestjs/bull';
import { PrismaService } from 'src/prisma.service';
import { Job } from 'bullmq';
import { DateHelper } from '@org/utils';

@Processor('subscription_events')
export class AppSubscriptionEventsProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('APP_SUBSCRIPTION')
  async handleAppSubscription(job: Job) {
    await this.processSubscriptionEvents(job);
  }

  @Process('APP_SUBSCRIPTION_AFTER')
  async handleAppSubscriptionAfter(job: Job) {
    await this.processSubscriptionEvents(job);
  }

  private async processSubscriptionEvents(job: Job) {
    try {
      const { app, events } = job.data;

      console.log('App: ', app);
      console.log('Subscription Events: ', events);

      for (const event of events) {
        const { type, shop, occurredAt } = event;
        const { appId, name, projectId, integrationId, organizationId } = app;

        // Ensure unique event processing
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
          // Check if lead exists
          const existingLead = await this.prisma.lead.findFirst({
            where: {
              shopifyDomain: shop.myshopifyDomain,
              shopifyStoreId: shop.id,
              integrationId: integrationId,
            },
          });

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

            // Create leadProject for this appId with integrationId
            const newLeadProject = await this.prisma.leadProject.create({
              data: {
                leadId: newLead.id,
                projectId,
                integrationId: integrationId,
                createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                updatedAt: 0,
                deletedAt: 0,
              },
            });

            console.log('LeadProject Created: ', newLeadProject.id);

            // Create leadActivity for new lead
            await this.prisma.leadActivity.create({
              data: {
                leadId: newLead.id,
                type: type,
                data: {
                  message: `${name} Subscription Event by store: ${shop.myshopifyDomain}`,
                  payload: event,
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
                  message: `${name} Subscription Event by store: ${shop.myshopifyDomain}`,
                  payload: event,
                },
                createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                updatedAt: 0,
                deletedAt: 0,
              },
            });
          }
        } else {
          console.log('Duplicate subscription event found, skipping processing.');
        }
      }
    } catch (error) {
      console.error('Error processing subscription events:', error);
    }
  }
}
