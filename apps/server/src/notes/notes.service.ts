import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLeadNoteDto, UpdateLeadNoteDto } from './dto/note.dto';
import { PrismaService } from 'src/config/prisma.service';
import { DateHelper } from '@org/utils';
import { LeadActivityService } from 'src/lead-activity/lead-activity.service';

@Injectable()
export class LeadNotesService {
  constructor(private prisma: PrismaService,private leadActivityService: LeadActivityService) {}

  async create(createLeadNoteDto: CreateLeadNoteDto) {
    try {
      console.log(createLeadNoteDto);
      const leadNote = await this.prisma.leadNotes.create({
        data: {
          data: createLeadNoteDto.data,
          leadId: createLeadNoteDto.leadId,
          createdAt: DateHelper.getCurrentUnixTime(),
          userId: createLeadNoteDto.userId,
          updatedAt: 0,
          deletedAt: 0,
        },
      });
      this.leadActivityService.create({
        type: 'NOTE_CREATED',
        data: { message: 'Lead note created',data:createLeadNoteDto.data },
        leadId: leadNote.leadId,
        userId: createLeadNoteDto.userId,
        organizationId: createLeadNoteDto.orgId,
      })
      return {
        status: true,
        message: 'Lead note created successfully',
        data: leadNote,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating lead note');
    }
  }

  async findAllByLeadId(leadId: string) {
    try {
      const leadNotes = await this.prisma.leadNotes.findMany({
        where: {
          leadId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        status: true,
        message: 'Lead notes retrieved successfully',
        data: leadNotes,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving lead notes');
    }
  }

  async findOne(id: string) {
    try {
      const leadNote = await this.prisma.leadNotes.findUnique({
        where: { id },
      });
      if (!leadNote) {
        throw new NotFoundException('Lead note not found');
      }
      return {
        status: true,
        message: 'Lead note retrieved successfully',
        data: leadNote,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving lead note');
    }
  }

  async update(id: string, updateLeadNoteDto: UpdateLeadNoteDto) {
    try {
      const leadNote = await this.prisma.leadNotes.update({
        where: { id },
        data: {
          ...updateLeadNoteDto,
          updatedAt: DateHelper.getCurrentUnixTime(),
        },
      });
      return {
        status: true,
        message: 'Lead note updated successfully',
        data: leadNote,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating lead note');
    }
  }

  async remove(id: string) {
    try {
      const leadNote = await this.prisma.leadNotes.delete({ where: { id } });
      return {
        status: true,
        message: 'Lead note deleted successfully',
        data: leadNote,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting lead note');
    }
  }
}
