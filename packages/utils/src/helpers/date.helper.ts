import { Injectable } from '@nestjs/common';
import { DateTime, DurationLike } from 'luxon';

@Injectable()
export class DateHelper {
  getCurrentUnixTime() {
    return DateTime.now().toLocal().toUTC().toUnixInteger();
  }
}
