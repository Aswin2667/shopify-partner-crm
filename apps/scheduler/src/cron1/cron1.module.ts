import { Module } from '@nestjs/common';
import { Cron1Service } from './cron1.service';

@Module({
  providers: [Cron1Service]
})
export class Cron1Module {}
