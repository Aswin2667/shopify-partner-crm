import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';


@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get(':leadId')
  async findAllByLeadId(@Param('leadId') id: string) {
    return this.contactService.findAllByLeadId(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
