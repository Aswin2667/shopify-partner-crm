import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../generated';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private static instance: PrismaService;
  private readonly logger = new Logger(PrismaService.name);

  private constructor() {
    super();
  }

  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma Client initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing Prisma Client:', error);
      throw error;
    }
  }
}

export { Prisma };
