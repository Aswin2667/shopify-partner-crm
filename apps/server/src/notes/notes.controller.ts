import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateLeadNoteDto, UpdateLeadNoteDto } from './dto/note.dto';
import { LeadNotesService } from './notes.service';


@Controller('lead-notes')
export class LeadNotesController {
  constructor(private readonly leadNotesService: LeadNotesService) {}

  @Post()
  create(@Body() createLeadNoteDto: CreateLeadNoteDto) {
    return this.leadNotesService.create(createLeadNoteDto);
  }

  @Get(':leadId')
  findAll( @Param('leadId') leadId: string) {
    return this.leadNotesService.findAllByLeadId(leadId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadNoteDto: UpdateLeadNoteDto) {
    return this.leadNotesService.update(id, updateLeadNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadNotesService.remove(id);
  }
}
