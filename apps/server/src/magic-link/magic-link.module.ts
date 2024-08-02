import { Module } from '@nestjs/common';
import { MagicLinkController } from './magic-link.controller';
import { MagicLinkService } from './magic-link.service';

@Module({
  controllers: [MagicLinkController],
  providers: [MagicLinkService],
  exports: [MagicLinkService],
})
export class MagicLinkModule {}
