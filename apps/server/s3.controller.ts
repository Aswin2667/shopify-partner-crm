import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { S3Service } from 'src/s3/s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  async uploadFile(@UploadedFile() file: any) {
    // if (!file) {
    //   throw new HttpException('No file uploaded.', HttpStatus.BAD_REQUEST);
    // }

    try {
      const result = await this.s3Service.uploadFile(file);
      return { message: 'File uploaded successfully', ...result };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error uploading file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
