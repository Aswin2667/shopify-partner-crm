import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { DateHelper } from '@org/utils';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByOrganizationId(id: string) {
    try {
      const data = await this.prisma.contact.findMany({
        where: {
          organizationId: id,
        },
        include: {
          lead: true,
        },
      });

      if (data.length === 0) {
        return {
          status: false,
          message: 'No contacts found for the given organization ID',
          data: [],
        };
      }

      return {
        status: true,
        message: 'Contacts retrieved successfully',
        data,
      };
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error retrieving contacts by organization ID:', error);

      return {
        status: false,
        message: 'An error occurred while retrieving contacts',
        data: null,
      };
    }
  }

  async create(data: CreateContactDto) {
    try {
      console.log(data);
      const contact = await this.prisma.contact.create({
        data: {
          primaryEmail: data.email,
          updatedAt: 0,
          deletedAt: 0,
          integrationId: data.integrationId,
          organizationId: data.organizationId,
          createdAt: DateHelper.getCurrentUnixTime(),
          leadId: data.leadId,
        },
      });
      return { status: true, message: 'Contact created', data: contact };
    } catch (error) {
      throw new Error('Failed to create contact');
    }
  }

  async findAllByLeadId(leadId: string) {
    console.log(leadId);
    try {
      const contacts = await this.prisma.contact.findMany({
        where: {
          leadId,
        },
      });
      return { status: true, message: 'Contacts retrieved', data: contacts };
    } catch (error) {
      throw new Error('Failed to retrieve contacts');
    }
  }

  async findOne(id: string) {
    try {
      const contact = await this.prisma.contact.findUnique({ where: { id } });
      if (!contact) throw new NotFoundException('Contact not found');
      return { status: true, message: 'Contact retrieved', data: contact };
    } catch (error) {
      throw new Error('Failed to retrieve contact');
    }
  }

  async update(id: string, data: UpdateContactDto) {
    try {
      const contact = await this.prisma.contact.update({
        where: { id },
        data,
      });
      return { status: true, message: 'Contact updated', data: contact };
    } catch (error) {
      throw new Error('Failed to update contact');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.contact.delete({ where: { id } });
      return { status: true, message: 'Contact deleted', data: id };
    } catch (error) {
      throw new Error('Failed to delete contact');
    }
  }
}
