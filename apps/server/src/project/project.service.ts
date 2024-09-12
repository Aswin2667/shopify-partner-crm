import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/projects.dto';
import { DateHelper } from '@org/utils';
import { z } from 'zod';
import { PrismaService } from '@org/data-source';

@Injectable()
export class ProjectService {

  constructor(private readonly prisma: PrismaService) {}
  updateAccessToken(id: string, body: {token:string}) {
   console.log(id, body)
   return this.prisma.project.update({
     where: { id },
     data: {
       cliAccessToken: body.token
     }
   })
  }
  async create(createProjectDto: z.infer<typeof CreateProjectDto>) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        type: createProjectDto.type,
        data: createProjectDto.data,
        integrationId: createProjectDto.integrationId,
        organizationId: createProjectDto.organizationId,
        createdAt: DateHelper.getCurrentUnixTime(),
        updatedAt: DateHelper.getCurrentUnixTime(),
      },
    });
  }

  async findAll(organizationId: string) {
    const organizationExist = await this.prisma.organization.findFirst({
      where: { id: organizationId },
    });

    if (!organizationExist) {
      throw new NotFoundException('Organization not found');
    }

    return this.prisma.project.findMany({
      where: { organizationId, deletedAt: null },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: z.infer<typeof UpdateProjectDto>) {
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        updatedAt: DateHelper.getCurrentUnixTime(),
      },
    });
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: DateHelper.getCurrentUnixTime() },
    });
  }
}
