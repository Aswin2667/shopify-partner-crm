// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store'
import { CacheManagerModule } from '@org/utils';


@Module({
 
  imports: [
    CacheManagerModule.register(),
    ScheduleModule.forRoot(),
  ],
  providers: [AppService, PrismaService],
 })
export class AppModule {}
