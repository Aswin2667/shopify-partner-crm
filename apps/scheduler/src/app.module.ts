// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CacheManagerModule } from '@org/utils';
import { AppController } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Cron1Module } from './cron1/cron1.module';
import { BullModule } from '@nestjs/bull';


@Module({
 
  imports: [
    CacheManagerModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    Cron1Module,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6378,
      },
    }),
    BullModule.registerQueue({
      name: 'install_uninstall_events',
    }),
    // Cron1Module,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
 })
export class AppModule {}
