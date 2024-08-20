import { Process, Processor } from "@nestjs/bull";
import { PrismaService } from "src/prisma.service";
import { Job } from "bullmq";
import { DateHelper } from "@org/utils";
import * as bcrypt from 'bcrypt'


@Processor('install_uninstall_events')
export class AppInstallsUninstallsEventsProcessor {

    constructor(private readonly prisma: PrismaService) {}

    @Process('APP_INSTALLED_UNINSTALLED')
    async handleAppInstalledUninstalled(job: Job) {
        try {
            // Check Already Existing lead 
            const leadsArray = job.data;

            for (const lead of leadsArray) {
                const { type, shop, occurredAt } = lead;
                
                // Check Already Existing lead 
                const existingLead = await this.prisma.lead.findFirst({
                    where: {
                        shopifyDomain: shop.myshopifyDomain
                    }
                });

                const saltOrRounds = 10;
                const hash = await bcrypt.hash(JSON.stringify(lead), saltOrRounds);
                const leadStr = JSON.stringify(lead)

                console.log(hash);

    
                if (!existingLead) {
                    const newLead = await this.prisma.lead.create({
                        data: {
                            shopifyDomain: shop.myshopifyDomain,
                            shopifyStoreId: shop.id,
                            createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                            updatedAt: 0,
                            deletedAt: 0, 
                        }
                    });
                    
                    console.log('New Lead Created:', newLead.id);

                    // create leadActivity for new lead
                    await this.prisma.leadActivity.create({
                        data: {
                            leadId: newLead.id,
                            data: {
                                message: 'created by sync',
                                string1 : leadStr,
                                hash: hash
                            },
                            type: type,
                            createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                            updatedAt: 0,
                            deletedAt: 0,
                        }
                    })

                } else {
                    console.log('Existing lead found:', existingLead.id);

                    await this.prisma.leadActivity.create({
                        data: {
                            leadId: existingLead.id,
                            data: {
                                message: 'created by sync',
                                string1 : leadStr,
                                hash: hash
                            },
                            type: type,
                            createdAt: DateHelper.convertIsoToTimestamp(occurredAt),
                            updatedAt: 0,
                            deletedAt: 0,
                        }
                    })

                }
    
            }         
        } catch (error) {
            console.log(error)
        } 
}


}