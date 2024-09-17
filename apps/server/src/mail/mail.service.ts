import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { google } from 'googleapis';
import { EmailStatus, PrismaService } from '@org/data-source';
import * as gmailApiSync from 'gmail-api-sync';
import { DateHelper } from '@org/utils';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getMailList(integrationId: string): Promise<any[]> {
    return this.prisma.email.findMany({
      where: { integrationId },
      orderBy: { sentAt: 'desc' },
    });
  }

  async getMails(integrationId: string): Promise<any[]> {
    return this.prisma.email.findMany({
      where: { integrationId },
      //   include: { replies: true },
    });
  }

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
}
