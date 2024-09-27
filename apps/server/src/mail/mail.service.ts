import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { google } from 'googleapis';
import { EmailStatus, PrismaService } from '@org/data-source';
import * as gmailApiSync from 'gmail-api-sync';
import { DateHelper } from '@org/utils';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getMailsByOrgId(organizationId: string): Promise<any[]> {
    try {
      return this.prisma.email.findMany({
        where: {
          organizationId,
        },
        include: {
          lead: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getMailsByLeadId(leadId: string): Promise<any[]> {
    try {
      return this.prisma.email.findMany({
        where: {
          leadId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getFromEmailsByOrgId(orgId: string) {
    try {
      return this.prisma.mailServiceFromEmail.findMany({
        where: {
          organizationId: orgId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async createFromEmail(data: any) {
    console.log(data);

    // Check if fromEmail already exists for the given type and organization
    const existingEmail = await this.prisma.mailServiceFromEmail.findFirst({
      where: {
        type: data.type,
        fromEmail: data.fromEmail,
        organizationId: data.organizationId,
      },
    });

    if (existingEmail) {
      // Throw an error if the email already exists
      throw new ConflictException(
        `The email ${data.fromEmail} already exists.`,
      );
    }

    // Check if type is 'GMAIL'
    if (data.type === 'GMAIL') {
      const existingGmail = await this.prisma.mailServiceFromEmail.findFirst({
        where: {
          type: 'GMAIL',
          organizationId: data.organizationId,
          integrationId: data.integrationId,
        },
      });

      if (existingGmail) {
        // Update the existing GMAIL entry's replyTo field
        return await this.prisma.mailServiceFromEmail.update({
          where: { id: existingGmail.id },
          data: {
            replyTo: data.replyTo ?? '', // Update only the replyTo field
          },
        });
      }
    }

    // If no GMAIL record exists or it's not a GMAIL type, create a new entry
    return await this.prisma.mailServiceFromEmail.create({
      data: {
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        replyTo: data.replyTo ?? '',
        type: data.type,
        integrationId: data.integrationId,
        organizationId: data.organizationId,
        createdAt: DateHelper.getCurrentUnixTime(),
      },
    });
  }

  async deleteFromEmail(id: any) {
    return await this.prisma.mailServiceFromEmail.delete({
      where: {
        id,
      },
    });
  }
}
