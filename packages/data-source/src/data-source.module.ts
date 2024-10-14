import { Global, Module } from '@nestjs/common';
import { PrismaService } from './shared/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DataSourceModule {}
