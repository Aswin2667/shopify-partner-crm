import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { DateHelper } from '@org/utils';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma.service';
import { Prisma } from '@prisma/client';

@Processor('gmail_integration_events')
export class GmailEventsProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('CONNECT_TO_GMAIL')
  async handleConnectToGmail(job: Job) {
    try {
      const { data } = job;
      const integrationExists = await this.prisma.integration.findFirst({
        where: {
          data: {
            path: ['email'],
            equals: data.email,
          },
        },
      });

      //   Creates new integration if not exists if exists will update the integration's accesstoken alone
      if (integrationExists) {
        await this.prisma.integration.update({
          where: {
            id: integrationExists.id,
          },
          data: {
            data: {
              googleId: data.googleId,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              email: data.email,
              name: data.name,
            } as unknown as Prisma.JsonValue,
            updatedAt: DateHelper.getCurrentUnixTime(),
          },
        });
      } else {
        await this.prisma.integration.create({
          data: {
            name: `${data.name}'s Gmail Integration`,
            description: `Integration with Gmail for ${data.email}`,
            type: data.type,
            isSingular: data.isSingular,
            organizationId: data.organizationId,
            data: {
              googleId: data.googleId,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              email: data.email,
              name: data.name,
            } as unknown as Prisma.JsonValue,
            createdAt: DateHelper.getCurrentUnixTime(),
            updatedAt: DateHelper.getCurrentUnixTime(),
            deletedAt: BigInt(0), // Assuming 0 means not deleted
          },
        });
      }
      console.log(integrationExists);
      console.log('data: ', data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
