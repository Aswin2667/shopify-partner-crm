import { Module } from '@nestjs/common';
import { UnsubscribeLinkController } from './unsubscribe-link.controller';
import { UnsubscribeLinkService } from './unsubscribe-link.service';
import { PrismaService } from '@org/data-source';

@Module({
  imports: [],
  controllers: [UnsubscribeLinkController],
  providers: [UnsubscribeLinkService, PrismaService],
})
export class UnsubscribeLinkModule {}
