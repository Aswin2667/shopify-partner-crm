import { Process, Processor } from "@nestjs/bull";
import { PrismaService } from "src/prisma.service";
import { Job } from "bullmq";


@Processor('app_events')
export class AppEventsProcessor {

    constructor(private readonly prismaService: PrismaService) {}

    @Process('APP_INSTALLED_UNINSTALLED')
    async handleAppInstalledUninstalled(job: Job) {
        const data = job.data;
        console.log(data);
    }

}