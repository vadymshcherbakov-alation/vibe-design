const hourlyRegex = /^(([0-9]|[1-5][0-9])\s(\*|\*\/[1-9]|\*\/[1-9][0-9]|\*\/100)\s\*\s\*\s\*)$/;
const dailyRegex = /^(([0-9]|[1-5][0-9])\s([0-9]|[1][0-9]|[2][0-3])\s(\*|\*\/[1-9]|\*\/[1-9][0-9]|\*\/100)\s\*\s\*)$/;
const monthlyRegex =
  /^(([0-9]|[1-5][0-9])\s([0-9]|[1][0-9]|[2][0-3])\s([1-9]|[1-2][0-9]|[3][0-1]|([1-9]|[12][0-9]|3[01])-([1-9]|[12][0-9]|3[01]))\s(\*|\*\/[1-9]|\*\/[1-9][0-9]|\*\/100)\s(\*|[0-6]))$/;
const weeklyRegex = /^(([0-9]|[1-5][0-9])\s([0-9]|[1][0-9]|[2][0-3])\s\*\s\*\s[0-6](,[0-6]){0,6})$/;

export const isHourlyCronTab = (crontab: string): boolean => {
  return hourlyRegex.test(crontab);
};

export const isDailyCronTab = (crontab: string): boolean => {
  return dailyRegex.test(crontab);
};

export const isWeeklyCronTab = (crontab: string): boolean => {
  return weeklyRegex.test(crontab);
};

export const isMonthlyCronTab = (crontab: string): boolean => {
  return monthlyRegex.test(crontab);
};

export const adjustCrontab = (crontab: string, minutes: number): string => {
  let adjustedMinutes = minutes;
  // We only support hour-, dai-, week-, and month-ly jobs for now
  //   For other types of jobs, we return crontab as it was.
  if (
    !isHourlyCronTab(crontab) &&
    !isDailyCronTab(crontab) &&
    !isWeeklyCronTab(crontab) &&
    !isMonthlyCronTab(crontab)
  ) {
    return crontab;
  }

  let daysShift = 0;
  // Assume abs(minutes) <= 24 * 60
  if (adjustedMinutes < 0) {
    adjustedMinutes = 24 * 60 + adjustedMinutes;
    daysShift = -1;
  }

  const arr = crontab.split(' ');
  let minute = arr[0];
  let hour = arr[1];
  let dayOfMonth = arr[2];
  const month = arr[3];
  let dayOfWeek = arr[4].split(',').length > 0 ? arr[4].split(',') : arr[4];

  const minutesForward = adjustedMinutes % 60;
  let hoursForward = Math.floor(adjustedMinutes / 60);
  const newMinute = parseInt(minute, 10) + minutesForward;
  if (newMinute / 60 >= 1) {
    hoursForward += 1;
  }
  minute = (newMinute % 60).toString(); // Set new minute string
  if (!isHourlyCronTab(crontab)) {
    const newHour = parseInt(hour, 10) + hoursForward;
    if (newHour / 24 >= 1) {
      daysShift += 1;
    }
    hour = (newHour % 24).toString(); // Set new hour string
  }

  if (daysShift !== 0) {
    if (isWeeklyCronTab(crontab)) {
      if (Array.isArray(dayOfWeek)) {
        dayOfWeek = dayOfWeek.map((day) => (parseInt(day, 10) + daysShift + 7) % 7).toString();
      } else {
        dayOfWeek = ((parseInt(dayOfWeek, 10) + daysShift + 7) % 7).toString();
      }
    } else if (isMonthlyCronTab(crontab)) {
      // For monthly cron with day ranges and weekday constraints:
      // - Day ranges represent "week of month" (1-7 = first week, 8-14 = second week, etc.)
      // - When timezone changes the day, we need to adjust the weekday, not the day range
      // - The day range should remain the same to preserve the "week of month" semantic

      if (dayOfMonth.includes('-')) {
        // It's a day range (e.g., "1-7", "8-14", "15-21", "22-28")
        // Don't modify the day range - it represents the week of the month
        // Only adjust the weekday if there's a specific weekday constraint
        if (dayOfWeek !== '*') {
          if (Array.isArray(dayOfWeek)) {
            dayOfWeek = dayOfWeek.map((day) => (parseInt(day, 10) + daysShift + 7) % 7).toString();
          } else {
            dayOfWeek = ((parseInt(dayOfWeek, 10) + daysShift + 7) % 7).toString();
          }
        }
        // Keep dayOfMonth unchanged for day ranges
      } else {
        // It's a single day - apply the original logic
        const currentDay = parseInt(dayOfMonth, 10);
        let newDay = currentDay + daysShift;

        // Handle month boundaries
        if (newDay <= 0) {
          newDay = newDay + 31; // Move to previous month (approximate)
        } else if (newDay > 31) {
          newDay = newDay - 31; // Move to next month (approximate)
        }

        dayOfMonth = newDay.toString();
      }
    }
  }

  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
};

export const getBrowserUtcOffset = (): number => {
  const now = new Date();
  return -now.getTimezoneOffset();
};

export const getTimezoneUtcOffset = (timezone: string): number => {
  try {
    const now = new Date();
    // Create a date formatter for the specific timezone
    const utcDate = new Date(now.toLocaleString('en-US', {timeZone: 'UTC'}));
    const tzDate = new Date(now.toLocaleString('en-US', {timeZone: timezone}));

    // Calculate the difference in minutes
    const offsetMinutes = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
    return offsetMinutes;
  } catch (error) {
    console.warn(`Invalid timezone "${timezone}", falling back to browser timezone`, error);
    return getBrowserUtcOffset();
  }
};

export const convertCrontabToBrowserTz = (crontab: string, serverUtcOffset: number): string => {
  if (typeof serverUtcOffset === 'undefined') {
    return crontab;
  }
  return adjustCrontab(crontab, getBrowserUtcOffset() - serverUtcOffset);
};

export const convertCrontabToServerTz = (crontab: string, serverUtcOffset: number, scheduleTimezone?: string) => {
  if (typeof serverUtcOffset === 'undefined') {
    return crontab;
  }

  // Use the specific schedule timezone if provided and valid, otherwise fall back to browser timezone
  const scheduleUtcOffset = scheduleTimezone ? getTimezoneUtcOffset(scheduleTimezone) : getBrowserUtcOffset();
  return adjustCrontab(crontab, serverUtcOffset - scheduleUtcOffset);
};

export const urlfy = <
  T = undefined | string | number | boolean | readonly string[] | readonly number[] | readonly boolean[],
>(
  obj: Record<string, T> = {},
) => {
  return Object.keys(obj)
    .map((k) => {
      const value = obj[k];
      if (value === undefined || value === null) {
        return '';
      }
      if (Array.isArray(value)) {
        return value
          .map((item) => {
            return `${encodeURIComponent(k)}[]=${encodeURIComponent(item)}`;
          })
          .filter(Boolean)
          .join('&');
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(value.toString())}`;
    })
    .filter(Boolean)
    .join('&');
};
