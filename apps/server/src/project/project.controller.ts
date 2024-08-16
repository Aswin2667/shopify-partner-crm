import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { ProjectService } from './project.service';
  import { CreateProjectDto, UpdateProjectDto } from './dto/projects.dto';
  import { z } from 'zod';
  
  @Controller('project')
  export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createProjectDto: z.infer<typeof CreateProjectDto>) {
      return this.projectService.create(CreateProjectDto.parse(createProjectDto));
    }
  
    @Get(':organizationId/all')
    findAll(@Param('organizationId') organizationId: string) {
      return this.projectService.findAll(organizationId);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.projectService.findOne(id);
    }
  
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() updateProjectDto: z.infer<typeof UpdateProjectDto>,
    ) {
      return this.projectService.update(id, UpdateProjectDto.parse(updateProjectDto));
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
      return this.projectService.remove(id);
    }
  }
  