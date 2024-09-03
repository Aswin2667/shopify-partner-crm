import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../shared/utils/prisma';
import { CreateProjectDto, UpdateProjectDto } from './dto/projects.dto';
import { DateHelper } from '@org/utils';
import { z } from 'zod';

@Injectable()
export class ProjectService {
  async create(createProjectDto: z.infer<typeof CreateProjectDto>) {
    return prisma.project.create({
      data: {
        name: createProjectDto.name,
        type: createProjectDto.type,
        data: createProjectDto.data,
        creAppId: "crmappid",
        appApiKey: "crmappapikey",
        integrationId: createProjectDto.integrationId,
        organizationId: createProjectDto.organizationId,
        createdAt: DateHelper.getCurrentUnixTime(),
        updatedAt: DateHelper.getCurrentUnixTime(),
      },
    });
  }

  async findAll(organizationId: string) {
    const organizationExist = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    if (!organizationExist) {
      throw new NotFoundException('Organization not found');
    }

    return prisma.project.findMany({
      where: { organizationId, deletedAt: null },
    });
  }

  async findOne(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: z.infer<typeof UpdateProjectDto>) {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    return prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        updatedAt: DateHelper.getCurrentUnixTime(),
      },
    });
  }

  async remove(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return prisma.project.update({
      where: { id },
      data: { deletedAt: DateHelper.getCurrentUnixTime() },
    });
  }
}
