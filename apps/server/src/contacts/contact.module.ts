import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { PrismaService } from '@org/data-source';
import { ContactController } from './contact.controller';


@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService],
})
export class ContactModule {}
