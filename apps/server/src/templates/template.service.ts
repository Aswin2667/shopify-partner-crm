import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';

@Injectable()
export class TemplateService {
  private templates = [];

  async create(createTemplateDto: CreateTemplateDto) {
    const existingTemplate = this.templates.find(
      (template) =>
        template.userId === createTemplateDto.userId &&
        template.scope === createTemplateDto.scope,
    );

    if (existingTemplate) {
      throw new BadRequestException(
        'A template with the same userId and scope already exists.',
      );
    }

    const newTemplate = {
      id: (this.templates.length + 1).toString(),
      ...createTemplateDto,
      createdAt: 123123123123,
      updatedAt: 123123123123,
      deletedAt: 0,
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async findOne(id: string) {
    const template = this.templates.find((template) => template.id === id);
    if (!template) {
      throw new NotFoundException('Template not found.');
    }
    return template;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    const index = this.templates.findIndex((template) => template.id === id);
    if (index === -1) {
      throw new NotFoundException('Template not found.');
    }

    if (!updateTemplateDto.html) {
      throw new BadRequestException(
        'HTML content is required for updating the template.',
      );
    }

    const updatedTemplate = {
      ...this.templates[index],
      ...updateTemplateDto,
      updatedAt: Date.now(),
    };
    this.templates[index] = updatedTemplate;
    return updatedTemplate;
  }

  async remove(id: string) {
    //  for remove opt
  }

  async findAllByUser(userId: string) {
    const templates = this.templates.filter(
      (template) => template.userId === userId,
    );
    if (templates.length === 0) {
      throw new NotFoundException('No templates found for the given user.');
    }
    return templates;
  }
}
