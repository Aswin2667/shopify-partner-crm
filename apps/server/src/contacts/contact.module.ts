import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { PrismaService } from 'src/config/prisma.service';
import { ContactController } from './contact.controller';


@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService],
})
export class ContactModule {}
