export function getBrowserUtcOffset(): number {
  const now = new Date();
  return -now.getTimezoneOffset();
}

const supportedTzAbbrNames: readonly string[] = [
  'PST',
  'PDT',
  'MST',
  'MDT',
  'CST',
  'CDT',
  'EST',
  'EDT',
  'NST',
  'NDT',
  'AST',
  'ADT',
  'AKST',
  'AKDT',
  'HAST',
  'HADT',
  'BRT',
  'BRST',
  'GMT',
  'BST',
  'CET',
  'CEST',
  'EET',
  'EEST',
  'FET',
  'IST',
  'SAMT',
  'MSK',
  'MSD',
  'WET',
  'WEST',
  'JST',
  'KST',
  'HST',
  'SGT',
  'ACST',
  'ACDT',
  'ACT',
  'ACWST',
  'AEST',
  'AEDT',
  'AET',
  'AWST',
  'AWDT',
  'CXT',
  'NZST',
  'NZDT',
  'CAT',
  'CVT',
  'EVT',
  'SAST',
  'WAST',
  'WAT',
];

function zeroPad(num: number, places: number): string {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

function getTzUtcRelativeName(customOffset?: number): string {
  let utcOffsetMinutes = getBrowserUtcOffset();
  if (customOffset) {
    utcOffsetMinutes = customOffset;
  }
  const prefix = `UTC${utcOffsetMinutes >= 0 ? '+' : '-'}`;
  const hour = Math.floor(Math.abs(utcOffsetMinutes) / 60);
  const minute = Math.floor(Math.abs(utcOffsetMinutes) % 60);
  return prefix + zeroPad(hour, 2) + zeroPad(minute, 2);
}

function getNumberOfStars(cronArr: readonly string[]): number {
  return cronArr.reduce((acc, curr) => (curr === '*' ? acc + 1 : acc), 0);
}

export function isHourlyJob(crontab: string): boolean {
  const arr = crontab.split(' ');
  return getNumberOfStars(arr) === 4 && arr[0] !== '*';
}

export function isDailyJob(crontab: string): boolean {
  const arr = crontab.split(' ');
  return getNumberOfStars(arr) === 3 && arr[0] !== '*' && arr[1] !== '*';
}

export function isWeeklyJob(crontab: string): boolean {
  const arr = crontab.split(' ');
  return getNumberOfStars(arr) === 2 && arr[2] === '*' && arr[3] === '*';
}

export function isMonthlyJob(crontab: string): boolean {
  const arr = crontab.split(' ');
  return getNumberOfStars(arr) === 2 && arr[3] === '*' && arr[4] === '*';
}

export function adjustCrontab(crontab: string, minutes: number): string {
  let adjustedMinutes = minutes;
  if (!isHourlyJob(crontab) && !isDailyJob(crontab) && !isWeeklyJob(crontab) && !isMonthlyJob(crontab)) {
    return crontab;
  }

  let daysShift = 0;
  if (adjustedMinutes < 0) {
    adjustedMinutes = 24 * 60 + adjustedMinutes;
    daysShift = -1;
  }

  const arr = crontab.split(' ');
  let minute = arr[0];
  let hour = arr[1];
  let dayOfMonth = arr[2];
  const month = arr[3];
  let dayOfWeek = arr[4];

  const minutesForward = adjustedMinutes % 60;
  let hoursForward = Math.floor(adjustedMinutes / 60);
  const newMinute = parseInt(minute, 10) + minutesForward;
  if (newMinute / 60 >= 1) {
    hoursForward += 1;
  }
  minute = (newMinute % 60).toString();

  if (!isHourlyJob(crontab)) {
    let parsedHour;
    if (hour.startsWith('*/')) {
      parsedHour = parseInt(hour.slice(2), 10); // This will give 5
    } else {
      parsedHour = parseInt(hour, 10);
    }
    const newHour = parsedHour + hoursForward;
    if (newHour / 24 >= 1) {
      daysShift += 1;
    }
    hour = (newHour % 24).toString();
  }

  if (daysShift !== 0) {
    if (isWeeklyJob(crontab)) {
      dayOfWeek = ((parseInt(dayOfWeek, 10) + daysShift + 7) % 7).toString();
    } else if (isMonthlyJob(crontab)) {
      dayOfMonth = (((parseInt(dayOfMonth, 10) + daysShift + 30) % 31) + 1).toString();
    }
  }

  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function adjustCrontabMinute(crontab: string, newMinute: number): string {
  const arr = crontab.split(' ');
  const hour = arr[1];
  const dayOfMonth = arr[2];
  const month = arr[3];
  const dayOfWeek = arr[4];

  return `${newMinute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function adjustCrontabHour(crontab: string, newHour: number): string {
  const arr = crontab.split(' ');
  const minute = arr[0];
  const dayOfMonth = arr[2];
  const month = arr[3];
  const dayOfWeek = arr[4];

  return `${minute} ${newHour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function adjustCrontabDayOfWeek(crontab: string, newDayOfWeek: number): string {
  const arr = crontab.split(' ');
  const minute = arr[0];
  const hour = arr[1];
  const dayOfMonth = arr[2];
  const month = arr[3];

  return `${minute} ${hour} ${dayOfMonth} ${month} ${newDayOfWeek}`;
}

export function adjustCrontabDayOfMonth(crontab: string, newDayOfMonth: number): string {
  const arr = crontab.split(' ');
  const minute = arr[0];
  const hour = arr[1];
  const month = arr[3];
  const dayOfWeek = arr[4];

  return `${minute} ${hour} ${newDayOfMonth} ${month} ${dayOfWeek}`;
}

export function getTzUtcOffset(timeZone = 'UTC', date: Date = new Date()): number {
  const utcDate = new Date(date.toLocaleString('en-US', {timeZone: 'UTC'}));
  const tzDate = new Date(date.toLocaleString('en-US', {timeZone}));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

export function convertCrontabToBrowserTz(crontab: string, serverUtcOffset?: number): string {
  if (typeof serverUtcOffset === 'undefined') {
    return crontab;
  }
  return adjustCrontab(crontab, getBrowserUtcOffset() - serverUtcOffset);
}

export function convertCrontabBrowserToUtcTz(crontab: string): string {
  return adjustCrontab(crontab, -getBrowserUtcOffset());
}

export function convertCrontabToServerTz(crontab: string, serverUtcOffset?: number): string {
  if (typeof serverUtcOffset === 'undefined') {
    return crontab;
  }
  return adjustCrontab(crontab, serverUtcOffset - getBrowserUtcOffset());
}

export function getTzDisplayString(tz: string): string {
  const now = new Date();
  let tzAbbr = '';
  if (now.toLocaleString) {
    const parts: string[] = now.toLocaleString('en-US', {timeZoneName: 'short', timeZone: tz}).split(' ');
    tzAbbr = parts[parts.length - 1] || '';
  }
  if (supportedTzAbbrNames.includes(tzAbbr)) {
    return tzAbbr;
  }
  return getTzUtcRelativeName(getTzUtcOffset(tz));
}

export function getBrowserTzString(): string {
  const now = new Date();
  let tzAbbr = '';
  if (now.toLocaleString) {
    const parts: string[] = now.toLocaleString('en-US', {timeZoneName: 'short'}).split(' ');
    tzAbbr = parts[parts.length - 1] || '';
  }
  if (supportedTzAbbrNames.includes(tzAbbr)) {
    return tzAbbr;
  }
  return getTzUtcRelativeName();
}

export const timezoneUtils = {
  adjustCrontab,
  adjustCrontabDayOfMonth,
  adjustCrontabDayOfWeek,
  adjustCrontabHour,
  adjustCrontabMinute,
  convertCrontabToBrowserTz,
  convertCrontabToServerTz,
  convertCrontabBrowserToUtcTz,
  getBrowserTzString,
  getTzUtcOffset,
  getTzDisplayString,
  isDailyJob,
  isHourlyJob,
  isMonthlyJob,
  isWeeklyJob,
};
