import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";


@Injectable()
export class GmailService {
 
    constructor() { }

    @Cron('*/5 * * * * *')
    async sentScheduledMails() {
        console.log('Running the cron to send scheduled mails...');

        


    }

}