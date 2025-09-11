import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export class DateUtils {
  private static _configuredTimezone: string = (() => {
    try {
      return process.env.APP_TIMEZONE ?? 'UTC';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'UTC';
    }
  })();

  static now(): dayjs.Dayjs {
    return dayjs().tz(DateUtils._configuredTimezone);
  }

  static today(): dayjs.Dayjs {
    return dayjs().tz(DateUtils._configuredTimezone).startOf('day');
  }

  static tomorrow(): dayjs.Dayjs {
    return dayjs()
      .tz(DateUtils._configuredTimezone)
      .add(1, 'day')
      .startOf('day');
  }

  static yesterday(): dayjs.Dayjs {
    return dayjs()
      .tz(DateUtils._configuredTimezone)
      .subtract(1, 'day')
      .startOf('day');
  }

  static parse(dateString: string): dayjs.Dayjs {
    return dayjs(dateString).tz(DateUtils._configuredTimezone);
  }

  static format(date: dayjs.Dayjs, formatString: string): string {
    return date.tz(DateUtils._configuredTimezone).format(formatString);
  }

  static addDays(date: dayjs.Dayjs, days: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).add(days, 'day');
  }

  static subDays(date: dayjs.Dayjs, days: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).subtract(days, 'day');
  }

  static addMonths(date: dayjs.Dayjs, months: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).add(months, 'month');
  }

  static subMonths(date: dayjs.Dayjs, months: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).subtract(months, 'month');
  }

  static addYears(date: dayjs.Dayjs, years: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).add(years, 'year');
  }

  static subYears(date: dayjs.Dayjs, years: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).subtract(years, 'year');
  }

  static addHours(date: dayjs.Dayjs, hours: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).add(hours, 'hour');
  }

  static subHours(date: dayjs.Dayjs, hours: number): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).subtract(hours, 'hour');
  }

  static startOfDay(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).startOf('day');
  }

  static endOfDay(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).endOf('day');
  }

  static startOfMonth(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).startOf('month');
  }

  static endOfMonth(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).endOf('month');
  }

  static startOfYear(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).startOf('year');
  }

  static endOfYear(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.tz(DateUtils._configuredTimezone).endOf('year');
  }

  static isBefore(date: dayjs.Dayjs, comparisonDate: dayjs.Dayjs): boolean {
    return date
      .tz(DateUtils._configuredTimezone)
      .isBefore(comparisonDate.tz(DateUtils._configuredTimezone));
  }

  static isAfter(date: dayjs.Dayjs, comparisonDate: dayjs.Dayjs): boolean {
    return date
      .tz(DateUtils._configuredTimezone)
      .isAfter(comparisonDate.tz(DateUtils._configuredTimezone));
  }

  static isToday(date: dayjs.Dayjs): boolean {
    return date
      .tz(DateUtils._configuredTimezone)
      .isSame(dayjs().tz(DateUtils._configuredTimezone), 'day');
  }

  static isTomorrow(date: dayjs.Dayjs): boolean {
    return date
      .tz(DateUtils._configuredTimezone)
      .isSame(dayjs().tz(DateUtils._configuredTimezone).add(1, 'day'), 'day');
  }

  static isYesterday(date: dayjs.Dayjs): boolean {
    return date
      .tz(DateUtils._configuredTimezone)
      .isSame(
        dayjs().tz(DateUtils._configuredTimezone).subtract(1, 'day'),
        'day',
      );
  }

  static isValid(
    date: string | number | dayjs.Dayjs | Date | null | undefined,
  ): boolean {
    return dayjs(date).isValid();
  }

  static differenceInDays(date1: dayjs.Dayjs, date2: dayjs.Dayjs): number {
    return date1
      .tz(DateUtils._configuredTimezone)
      .diff(date2.tz(DateUtils._configuredTimezone), 'day');
  }

  static differenceInHours(date1: dayjs.Dayjs, date2: dayjs.Dayjs): number {
    return date1
      .tz(DateUtils._configuredTimezone)
      .diff(date2.tz(DateUtils._configuredTimezone), 'hour');
  }

  static differenceInMinutes(date1: dayjs.Dayjs, date2: dayjs.Dayjs): number {
    return date1
      .tz(DateUtils._configuredTimezone)
      .diff(date2.tz(DateUtils._configuredTimezone), 'minute');
  }

  static differenceInSeconds(date1: dayjs.Dayjs, date2: dayjs.Dayjs): number {
    return date1
      .tz(DateUtils._configuredTimezone)
      .diff(date2.tz(DateUtils._configuredTimezone), 'second');
  }

  static distanceToNow(date: dayjs.Dayjs): string {
    return date.tz(DateUtils._configuredTimezone).fromNow();
  }

  static getDate(date: dayjs.Dayjs): string {
    return date.tz(DateUtils._configuredTimezone).format('D MMMM YYYY');
  }

  static getTime(date: dayjs.Dayjs): string {
    return date.tz(DateUtils._configuredTimezone).format('HH:mm');
  }

  static getDateHuman(date: dayjs.Dayjs): string {
    return date.tz(DateUtils._configuredTimezone).fromNow();
  }

  static getDateInformative(date: dayjs.Dayjs): string {
    return date.tz(DateUtils._configuredTimezone).format('dddd, MMMM D, YYYY');
  }

  static getDateTimeInformative(date: dayjs.Dayjs): string {
    return date
      .tz(DateUtils._configuredTimezone)
      .format('dddd, MMMM D, YYYY HH:mm');
  }

  // These methods already accept timezone as a parameter, so we keep them as is
  static getDateWithTimezone(date: dayjs.Dayjs, timezone: string): string {
    return date.tz(timezone).format('D MMMM YYYY');
  }

  static getDateTimeWithTimezone(date: dayjs.Dayjs, timezone: string): string {
    return date.tz(timezone).format('D MMMM YYYY HH:mm z');
  }

  static getDateInformativeWithTimezone(
    date: dayjs.Dayjs,
    timezone: string,
  ): string {
    return date.tz(timezone).format('dddd, MMMM D, YYYY z');
  }

  static getDateTimeInformativeWithTimezone(
    date: dayjs.Dayjs,
    timezone: string,
  ): string {
    return date.tz(timezone).format('dddd, MMMM D, YYYY HH:mm z');
  }

  // Add a utility method to get the configured timezone
  static getConfiguredTimezone(): string {
    return DateUtils._configuredTimezone;
  }
}
