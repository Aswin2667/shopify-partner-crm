import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    try {
      console.log(createTemplateDto);
      const template = await this.templateService.create(createTemplateDto);
      return {
        status: true,
        message: 'Template created successfully.',
        data: template,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
     const data = await this.templateService.findAllByOrg(id);
     return {
      status:true,
      message:"Template retrieved successfully.",
      data
     }
    } catch (error) {
      console.log(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    try {
      const template = await this.templateService.update(id, updateTemplateDto);
      if (!template) {
        throw new HttpException('Template not found.', HttpStatus.NOT_FOUND);
      }
      return {
        status: true,
        message: 'Template updated successfully.',
        data: template,
      };
    } catch (error) {}
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.templateService.remove(id);

      return {
        status: true,
        message: 'Template deleted successfully.',
      };
    } catch (error) {}
  }

  @Get('org/:orgId')
  async findAllByUser(@Param('userId') orgId: string) {
    try {
      const templates = await this.templateService.findAllByOrg(orgId);
      return {
        status: true,
        message: 'Templates retrieved successfully.',
        data: templates,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
