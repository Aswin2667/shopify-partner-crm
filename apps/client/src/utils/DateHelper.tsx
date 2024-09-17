import { DateTime } from "luxon";

export default class DateHelper {
  public static getCurrentUnixTime() {
    return DateTime.now().toLocal().toUTC().toUnixInteger();
  }
  public static formatTimestamp(utcTimestamp: number) {
    // Convert the UTC timestamp to milliseconds
    if (!utcTimestamp || utcTimestamp == undefined) return "";

    const date = new Date(utcTimestamp * 1000);

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const formattedDate = dateFormatter.format(date);
    const formattedTime = timeFormatter.format(date);
    return `At ${formattedDate} at ${formattedTime}`;
  }
  public static convertToDateString(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  public static convertToUnixTimestamp(dateString: string) {
    const date = DateTime.fromJSDate(new Date(dateString));
    const unixTimestamp = date.toSeconds();
    // console.log(unixTimestamp);
    // console.log(this.convertToDateString(unixTimestamp));
    return unixTimestamp;
  }
}
