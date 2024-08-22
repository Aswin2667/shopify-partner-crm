import { Process, Processor } from '@nestjs/bull';
import { MailService } from '@org/utils';
import { Job } from 'bullmq';
import { UserInviteTemplate } from 'src/templates/email/UserInvite';

@Processor('events')
export class UserEventsProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('USER_CREATED')
  async handleUserCreated(job: Job) {
    const data = job.data;
    console.log(data);
    await this.mailService
      .sendUserConfirmation(data.email, JSON.stringify(data))
      .then(() => {
        console.log('Email sent successfully');
      });
  }

  @Process('ORGANIZATION_MEMBER_INVITATION')
  async handleOrgInviteCreated(job: Job) {
    const data = job.data;
    const html = UserInviteTemplate(
      data.invite_sender_name,
      data.invite_sender_organization_name,
      data.Product_Name,
      data.action_url,
      data.name,
    );
    await this.mailService.sendMail(data.emails, html);
    console.log(data);
  }
}
