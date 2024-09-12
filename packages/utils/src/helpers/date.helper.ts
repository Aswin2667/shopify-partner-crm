import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class DateHelper {
  public static getCurrentUnixTime() {
    return DateTime.now().toLocal().toUTC().toUnixInteger();
  }
  public static formatTimestamp(utcTimestamp) {
    // Convert the UTC timestamp to milliseconds
    const date = new Date(utcTimestamp * 1000);

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    const formattedDate = dateFormatter.format(date);
    const formattedTime = timeFormatter.format(date);

    return `At ${formattedDate} at ${formattedTime}`;
  }
  public static  convertIsoToTimestamp(isoString) {
    // Parse the ISO 8601 string to a DateTime object
    const dateTime = DateTime.fromISO(isoString, { zone: 'utc' });
    
    return dateTime.toMillis() / 1000;
  }

}
