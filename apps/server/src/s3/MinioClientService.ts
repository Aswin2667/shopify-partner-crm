// import { Injectable } from '@nestjs/common';
// import { MinioService } from 'nestjs-minio-client';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class MinioClientService {
//   private readonly bucketName = 'media-library';

//   constructor(
//     private readonly minio: MinioService,
//     private readonly configService: ConfigService,
//   ) {}

//   async uploadFile(file: Express.Multer.File) {
//     const fileName = `${Date.now()}_${file.originalname}`;
//     await this.minio.client.putObject(this.bucketName, fileName, file.buffer);
//     return { fileName };
//   }

//   async listFiles() {
//     const stream = this.minio.client.listObjects(this.bucketName, '', true);
//     const files = [];
//     return new Promise((resolve, reject) => {
//       stream.on('data', (obj) => files.push(obj));
//       stream.on('end', () => resolve(files));
//       stream.on('error', reject);
//     });
//   }

//   async getFileUrl(fileName: string) {
//     const url = await this.minio.client.presignedUrl(
//       'GET',
//       this.bucketName,
//       fileName,
//     );
//     return url;
//   }
// }
