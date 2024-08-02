import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerClient } from 'postmark';
import { generate } from 'otp-generator';
import { SendEmailType, SendOtpType } from './types';

@Injectable()
export class MailService {
  private Transporter: ServerClient;

  constructor(private readonly config: ConfigService) {
    if (!this.Transporter) {
      this.Transporter = new ServerClient(
        this.config.get<string>('POSTMARK_TOKEN'),
      );
    }
  }

  async sendOtp({ email, storeName }: SendOtpType): Promise<number> {
    try {
      const generateOtp: String = generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });

      await this.Transporter.sendEmailWithTemplate({
        From: this.config.get<string>('FROM_EMAIL_ADDRESS'),
        To: `${email}`,
        TemplateId: 34308445,
        TemplateModel: {
          name: `${email}`,
          otp: generateOtp,
          storeName: storeName
        },
      });

      return Number(generateOtp);
    } catch (error) {
      throw error;
    }
  }

  async sendEmail({ body, email, subject }: SendEmailType) {
    try {
      const emailDetail = await this.Transporter.sendEmail({
        From: this.config.get<string>('FROM_EMAIL_ADDRESS'),
        To: email,
        HtmlBody: body,
        Subject: subject,
      });

      return emailDetail;
    } catch (error) {
      throw error;
    }
  }
}