import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateHelper } from '@org/utils';
@Injectable()
export class EmailOpenService {
  // Base64 encoded 1x1 pixel image
  private readonly onePxImageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/xyB42IAAAAASUVORK5CYII=';

  constructor(
    @InjectQueue('email-tracking-queue') private emailTrackingQueue: Queue,
  ) {}

  getOnePixelImage(id: string): string {
    console.log('Email opened, ID:', id);

     this.emailTrackingQueue.add('email-opened', {
      emailId: id,
      openedAt: DateHelper.getCurrentUnixTime(),
      eventSource: 'TRACKER',
    });
    return this.onePxImageBase64;
  }
}
