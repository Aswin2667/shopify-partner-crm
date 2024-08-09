import {
    Injectable,
    HttpException,
    HttpStatus,
    Inject,
    LoggerService,
  } from '@nestjs/common';
  import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
  import * as Minio from 'minio';
  import { v4 as uuidv4 } from 'uuid';
  import * as path from 'path';
  @Injectable()
  export class S3Service {
    private readonly bucketName = 'test-bucket';
  
    private readonly s3Client = new Minio.Client({
      endPoint: 'localhost',
      port: 9001,
      useSSL: false,
      accessKey: 'H3JdkWnLNi1Nyh17zOjG',
      secretKey: 'cChBnNjQgSiuNf0oDuSvQ66T1heJ20ZDbaXe8KmU',
    });
  
    constructor(
      @Inject(WINSTON_MODULE_NEST_PROVIDER)
      private readonly logger: LoggerService,
    ) {}
  
    async uploadFile(file: any): Promise<{ imageUrl: string }> {
      if (!file) {
        throw new HttpException('No file uploaded.', HttpStatus.BAD_REQUEST);
      }
  
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  
      try {
        await this.s3Client.putObject(
          this.bucketName,
          fileName,
          file.buffer,  // Now this should be a Buffer
          file.size,    // Should match the size of the file buffer
          {
            'Content-Type': file.mimetype,
          },
        );
  
        const imageUrl = await this.s3Client.presignedGetObject(
          this.bucketName,
          fileName,
        );
  
        return { imageUrl };
      } catch (err) {
        this.logger.error('Error uploading file:', err.message, err.stack);
        throw new HttpException(
          `Error uploading file: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  