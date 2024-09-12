import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { PrismaService } from 'src/config/prisma.service';
import { DateHelper } from '@org/utils';

@Injectable()
export class TemplateService {
  private templates = [];
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTemplateDto: CreateTemplateDto) {
    try {
      const template = await this.prismaService.template.create({
        data: {
          html: createTemplateDto.html,
          userId: createTemplateDto.userId,
          orgId: createTemplateDto.orgId,
          name: createTemplateDto.name,
          isEnabled: true,
          updatedAt: 0,
          createdAt: DateHelper.getCurrentUnixTime(),
          deletedAt: 0,
        },
      });
      return template;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    const template = this.templates.find((template) => template.id === id);
    if (!template) {
      throw new NotFoundException('Template not found.');
    }
    return template;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    try {
      const template = await this.prismaService.template.findUnique({
        where: { id },
      });
      if (!template) {
        throw new NotFoundException('Template not found.');
      }

      const updatedTemplate = await this.prismaService.template.update({
        where: { id },
        data: {
          ...updateTemplateDto,
        },
      });
      return updatedTemplate;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    //  for remove opt
  }

  async findAllByOrg(orgId: string) {
    try {
      return await this.prismaService.template.findMany({
        where: {
          orgId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
