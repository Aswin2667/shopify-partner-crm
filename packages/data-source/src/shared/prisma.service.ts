import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../generated';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

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
export { Prisma }
