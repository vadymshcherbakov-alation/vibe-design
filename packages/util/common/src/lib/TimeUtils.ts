import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/plugin/relativeTime';

// Type definition for timestamp parameter
type Timestamp = string | number | Date;

export function getDateString(timestamp: Timestamp): string {
  const time: Dayjs = dayjs(timestamp);
  let dateFormat = 'MMM D';
  if (!time.isSame(dayjs(), 'year')) {
    dateFormat = 'MMM D[,] YYYY';
  }
  return time.format(dateFormat);
}

export function getHourInAm(hour: number): number {
  if (typeof hour !== 'number' || hour < 0 || hour > 23) {
    throw new TypeError('expected integer [0-23] as input');
  }

  return hour < 12 ? hour : hour - 12;
}

export function getHourInPm(hour: number): number {
  if (typeof hour !== 'number' || hour < 0 || hour > 23) {
    throw new TypeError('expected integer [0-23] as input');
  }

  return hour >= 12 ? hour : hour + 12;
}

/**
 * Splits time ago to a list of time. First item date, second item time
 * Still preserves seconds / minutes ago messaging
 * won't always return list of two items
 */
export function getMultiLineTimeago(timestamp: Timestamp): readonly string[] {
  const timeAgo = getTimeAgo(timestamp);
  return splitTimeAgo(timeAgo);
}

/**
 * Formats the time ago using moment.
 * The daysAgoCutoff parameter determines the threshold (in days) for switching
 * from relative time (e.g., "3 days ago") to a specific date and time format
 * (e.g., "Jan 5, 2020 at 3:30 PM"). By default, this cutoff is set to 7 days.
 */
export function getTimeAgo(timestamp: Timestamp, daysAgoCutoff = 7): string {
  const now = dayjs();
  const time = dayjs(timestamp);

  if (now.diff(time, 'days') < daysAgoCutoff) {
    // Less than daysAgoCutoff days ago, use fromNow() method
    return time.fromNow();
  }
  // More than 7 days ago, format with specific date and time
  return time.format('MMM D[,] YYYY [at] h:mm A');
}

/**
 * Splits the formatted time ago into date and time parts
 */
function splitTimeAgo(timeAgo: string): readonly string[] {
  const match = timeAgo.match(/(.*) at (.*)/);
  if (match) {
    const [, datePart, timePart] = match;
    return [datePart.trim(), timePart.trim()];
  }
  return [timeAgo.trim(), ''];
}

export function formatTimeDuration(
  seconds: number | null,
  options?: {
    readonly showDays?: boolean;
    readonly showHours?: boolean;
    readonly showMinutes?: boolean;
    readonly showSeconds?: boolean;
  },
): string {
  if (isNaN(seconds as number) || seconds === null || seconds < 0) {
    return '';
  }

  // Special case: if seconds is 0, return "0 seconds"
  if (seconds === 0) {
    return '0 seconds';
  }

  const {showDays = true, showHours = true, showMinutes = true, showSeconds = true} = options || {};

  let remainingTime = seconds;
  let result = '';

  // Calculate and display days
  if (showDays) {
    const days = Math.floor(remainingTime / (3600 * 24));
    if (days > 0) {
      result += `${days}d `;
      remainingTime -= days * 3600 * 24;
    }
  }

  // Calculate and display hours
  if (showHours) {
    const hours = Math.floor(remainingTime / 3600);
    if (hours > 0) {
      result += `${hours}hr `;
      remainingTime -= hours * 3600;
    }
  }

  // Calculate and display minutes
  if (showMinutes) {
    const minutes = Math.floor(remainingTime / 60);
    if (minutes > 0) {
      result += `${minutes}min `;
      remainingTime -= minutes * 60;
    }
  }

  // Calculate and display seconds
  if (showSeconds) {
    const secs = Math.floor(remainingTime);
    if (secs > 0) {
      result += `${secs}s`;
    }
  }

  return result.trim();
}
