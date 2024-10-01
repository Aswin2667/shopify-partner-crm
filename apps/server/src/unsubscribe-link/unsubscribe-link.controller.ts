import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UnsubscribeLinkService } from './unsubscribe-link.service';

@Controller('unsubscribe-link')
export class UnsubscribeLinkController {
  constructor(
    private readonly unSubscribeLinkService: UnsubscribeLinkService,
  ) {}

  @Get(':orgId')
  async getUnsubscribeLinkByOrgId(@Param('orgId') orgId: string) {
    try {
      const unsubscribeLinks =
        await this.unSubscribeLinkService.getByOrgId(orgId);

      return {
        status: true,
        data: unsubscribeLinks,
        message: 'UnSubscribe Link retrieved successfully.',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while retrieving Unsubscribe Link.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createUnsubscribeLink(@Body() data: any) {
    try {
      const unsubscribeLink = await this.unSubscribeLinkService.create(data);

      return {
        status: true,
        data: unsubscribeLink,
        message: 'UnSubscribe Link created successfully.',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while creating Unsubscribe Link.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
