// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheManagerModule } from '@org/utils';
import { AppController } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { AppService } from './app.service';
import { Install_uninstall_dataService } from './app-data/install_uninstall.service';


@Module({
  imports: [
    CacheManagerModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6378,
      },
    }),
    BullModule.registerQueue(
      {
      name: 'install_uninstall_events',
      },
      {
        name: 'subscription_events',
      },
      {
        name: 'credit_events',
      }
  ),
  ],
  controllers: [AppController],
  providers: [AppService, Install_uninstall_dataService],
 })

 
export class AppModule {}





