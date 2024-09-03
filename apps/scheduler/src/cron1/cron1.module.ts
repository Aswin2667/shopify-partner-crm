// import { Module } from '@nestjs/common';
// import { CreditEventsService } from './cron1.service';
// import { CacheManagerModule } from '@org/utils';
// import { ScheduleModule } from '@nestjs/schedule';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { BullModule } from '@nestjs/bull';
// import { PrismaService } from 'src/prisma.service';

// @Module({
//   imports: [
//     CacheManagerModule.register(),
//     ScheduleModule.forRoot(),
//     EventEmitterModule.forRoot(),
//     Cron1Module,
//     BullModule.forRoot({
//       redis: {
//         host: 'localhost',
//         port: 6378,
//       },
//     }),
//     BullModule.registerQueue({
//       name: 'credit_events',
//     }),
//   ],
//   providers: [CreditEventsService, PrismaService]
// })
// export class Cron1Module {}
