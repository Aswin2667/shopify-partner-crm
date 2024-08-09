import { Process, Processor } from '@nestjs/bull';
import { MailService } from '@org/utils';
import { Job } from 'bullmq';

@Processor('events')
export class UserEventsProcessor {

  constructor(private readonly mailService: MailService) {}

  @Process('USER_CREATED')
  async handleUserCreated(job: Job) {
    const data = job.data;
    console.log(data);
    await this.mailService.sendUserConfirmation(data.email, JSON.stringify(data)).then(()=>{
      console.log("Email sent successfully")
    });
  }
}