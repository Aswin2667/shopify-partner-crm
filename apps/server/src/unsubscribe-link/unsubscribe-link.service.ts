import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/data-source';

@Injectable()
export class UnsubscribeLinkService {
  constructor(
    // private readonly unSUbscribeLinkService: UnsubscribeLinkService,
    private readonly prisma: PrismaService,
  ) {}

  async getByOrgId(id: string) {
    try {
      const response = await this.prisma.unsubscribeLink.findMany({
        where: {
          organizationId: id,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async create(data: any) {
    try {
      const response = await this.prisma.unsubscribeLink.upsert({
        where: {
          id: data.id,
          organizationId: data.organizationId,
        },
        update: {
          name: data.name,
          message: data.message ?? '',
          anchorText: data.anchorText,
        },
        create: {
          name: data.name,
          message: data.message ?? '',
          anchorText: data.anchorText,
          organizationId: data.organizationId,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
