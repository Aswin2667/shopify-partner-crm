import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SendMagicLinkDto, VerifyMagicTokenDto } from './dto/magic-link.dto';
import { MagicLinkService } from './magic-link.service';

@Controller('magic-link')
export class MagicLinkController {
  constructor(private readonly magicLinkService: MagicLinkService) {}

  @Post('send')
  async sendMagicLink(@Body() sendMagicLinkDto: SendMagicLinkDto) {
    try {
      await this.magicLinkService.sendMagicLink(sendMagicLinkDto.email);
      return {
        status: true,
        message: 'Magic link sent to the provided email.',
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while sending the magic link.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('verify')
  async verifyMagicToken(@Query() query: VerifyMagicTokenDto) {
    try {
      const user = await this.magicLinkService.verifyToken(query.token);
      return {
        status: true,
        message: 'Token verified successfully.',
        user,
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while verifying the token.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
