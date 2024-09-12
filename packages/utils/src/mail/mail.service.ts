import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(userEmail: string, data: string) {
    try {
      await this.mailerService
        .sendMail({
          from: 'bikecare.no.replay@gmail.com',
          to: userEmail, // list of receivers
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: 'welcome', // plaintext body
          html: '<b>welcome</b>', // HTML body content
        })
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send confirmation email.');
    }
  }
  async sendMail(userEmail: string, template: string) {
    try {
      await this.mailerService
        .sendMail({
          from: 'bikecare.no.replay@gmail.com',
          to: userEmail, // list of receivers
          subject: 'Shopify Partner CRM Invitation',
          html: template,
        })
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send confirmation email.');
    }
  }
  async sendResetPassword(userEmail: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Reset your Password',
        template: './reset-password',
        context: {
          token,
        },
      });
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new Error('Failed to send reset password email.');
    }
  }
}
