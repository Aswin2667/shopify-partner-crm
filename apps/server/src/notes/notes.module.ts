import { Module } from '@nestjs/common';
import { LeadNotesController } from './notes.controller';
import { PrismaService } from 'src/config/prisma.service';
import { LeadNotesService } from './notes.service';


@Module({
  controllers: [LeadNotesController],
  providers: [LeadNotesService, PrismaService],
})
export class LeadNotesModule {}
