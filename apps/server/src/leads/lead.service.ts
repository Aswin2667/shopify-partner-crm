import { Injectable } from '@nestjs/common';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadService {
  private leads = [];

  async findAllByAppId(appId: string) {
    return this.leads.filter((lead) => lead.appId === appId);
  }

  async findOne(leadId: string) {
    return this.leads.find((lead) => lead.id === leadId);
  }

  async create(createLeadDto: CreateLeadDto) {
    const newLead = {
      id: 'unique-id',
      ...createLeadDto,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: 0,
    };
    this.leads.push(newLead);
    return newLead;
  }

  async update(leadId: string, updateLeadDto: UpdateLeadDto) {
    const index = this.leads.findIndex((lead) => lead.id === leadId);
    if (index === -1) {
      return null;
    }
    const updatedLead = {
      ...this.leads[index],
      ...updateLeadDto,
      updatedAt: Date.now(),
    };
    this.leads[index] = updatedLead;
    return updatedLead;
  }

  async remove(leadId: string) {
    const index = this.leads.findIndex((lead) => lead.id === leadId);
    if (index === -1) {
      return null;
    }
    const [deletedLead] = this.leads.splice(index, 1);
    deletedLead.deletedAt = Date.now();
    return deletedLead;
  }
}
