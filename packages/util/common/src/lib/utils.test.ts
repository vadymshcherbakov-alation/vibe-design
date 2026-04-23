import {
  adjustCrontab,
  convertCrontabToBrowserTz,
  convertCrontabToServerTz,
  isDailyCronTab,
  isHourlyCronTab,
  isMonthlyCronTab,
  isWeeklyCronTab,
  urlfy,
} from './utils';

describe('CronTab Regex Tests', () => {
  describe('isHourlyCronTab', () => {
    it('should return true for valid hourly crontab', () => {
      expect(isHourlyCronTab('15 * * * *')).toBe(true);
      expect(isHourlyCronTab('45 */5 * * *')).toBe(true);
    });

    it('should return false for invalid hourly crontab', () => {
      expect(isHourlyCronTab('15 * * *')).toBe(false);
      expect(isHourlyCronTab('15 * * * * *')).toBe(false);
      expect(isHourlyCronTab('61 * * * *')).toBe(false);
    });
  });

  describe('isDailyCronTab', () => {
    it('should return true for valid daily crontab', () => {
      expect(isDailyCronTab('15 10 * * *')).toBe(true);
      expect(isDailyCronTab('45 23 * * *')).toBe(true);
    });

    it('should return false for invalid daily crontab', () => {
      expect(isDailyCronTab('15 10 * *')).toBe(false);
      expect(isDailyCronTab('15 10 * * * *')).toBe(false);
      expect(isDailyCronTab('15 24 * * *')).toBe(false);
    });
  });

  describe('isWeeklyCronTab', () => {
    it('should return true for valid weekly crontab', () => {
      expect(isWeeklyCronTab('15 10 * * 0')).toBe(true);
      expect(isWeeklyCronTab('45 23 * * 6,0')).toBe(true);
    });

    it('should return false for invalid weekly crontab', () => {
      expect(isWeeklyCronTab('15 10 * *')).toBe(false);
      expect(isWeeklyCronTab('15 10 * * 7')).toBe(false);
      expect(isWeeklyCronTab('45 23 * * 6,7')).toBe(false);
    });
  });

  describe('isMonthlyCronTab', () => {
    it('should return true for valid monthly crontab', () => {
      expect(isMonthlyCronTab('15 10 1 * *')).toBe(true);
      expect(isMonthlyCronTab('45 23 31 * *')).toBe(true);
    });

    it('should return false for invalid monthly crontab', () => {
      expect(isMonthlyCronTab('15 10 32 * *')).toBe(false);
      expect(isMonthlyCronTab('45 23 0 * *')).toBe(false);
      expect(isMonthlyCronTab('15 10 * *')).toBe(false);
    });
  });
});

describe('CronTab Adjustment Tests', () => {
  describe('adjustCrontab', () => {
    it('should adjust hourly crontab correctly', () => {
      expect(adjustCrontab('15 * * * *', 30)).toBe('45 * * * *');
      expect(adjustCrontab('45 * * * *', -30)).toBe('15 * * * *');
    });

    it('should adjust daily crontab correctly', () => {
      expect(adjustCrontab('15 10 * * *', 60)).toBe('15 11 * * *');
      expect(adjustCrontab('15 10 * * *', -60)).toBe('15 9 * * *');
    });

    it('should adjust weekly crontab correctly', () => {
      expect(adjustCrontab('15 10 * * 0', 1440)).toBe('15 10 * * 1'); // Shift 1 day forward
      expect(adjustCrontab('15 10 * * 0', -1440)).toBe('15 10 * * 6'); // Shift 1 day backward
    });

    it('should adjust monthly crontab correctly', () => {
      expect(adjustCrontab('15 10 1 * *', 1440)).toBe('15 10 2 * *');
      expect(adjustCrontab('15 10 1 * *', -1440)).toBe('15 10 31 * *');
    });
  });

  describe('convertCrontabToBrowserTz', () => {
    it('should convert crontab from server timezone to browser timezone correctly', () => {
      vi.spyOn(global.Date.prototype, 'getTimezoneOffset').mockReturnValue(-300);
      expect(convertCrontabToBrowserTz('15 10 * * *', 0)).toBe('15 15 * * *'); // Server UTC to Browser UTC+5
    });
  });

  describe('convertCrontabToServerTz', () => {
    it('should convert crontab from browser timezone to server timezone correctly', () => {
      vi.spyOn(global.Date.prototype, 'getTimezoneOffset').mockReturnValue(-300);
      expect(convertCrontabToServerTz('15 5 * * *', 0)).toBe('15 0 * * *');
    });
  });
});

describe('urlfy', () => {
  it('should return an empty string when the object is empty', () => {
    expect(urlfy({})).toBe('');
  });

  it('should handle single key-value pairs', () => {
    expect(urlfy({foo: 'bar'})).toBe('foo=bar');
  });

  it('should handle multiple key-value pairs', () => {
    expect(urlfy({foo: 'bar', baz: 'qux'})).toBe('foo=bar&baz=qux');
  });

  it('should handle undefined values', () => {
    expect(urlfy({foo: undefined, bar: 'baz'})).toBe('bar=baz');
  });

  it('should handle null values', () => {
    expect(urlfy({foo: null, bar: 'baz'})).toBe('bar=baz');
  });

  it('should handle numeric values', () => {
    expect(urlfy({foo: 123, bar: 456})).toBe('foo=123&bar=456');
  });

  it('should handle boolean values', () => {
    expect(urlfy({foo: true, bar: false})).toBe('foo=true&bar=false');
  });

  it('should handle arrays of strings', () => {
    expect(urlfy({foo: ['bar', 'baz']})).toBe('foo[]=bar&foo[]=baz');
  });

  it('should handle arrays of numbers', () => {
    expect(urlfy({foo: [1, 2, 3]})).toBe('foo[]=1&foo[]=2&foo[]=3');
  });

  it('should handle arrays of booleans', () => {
    expect(urlfy({foo: [true, false]})).toBe('foo[]=true&foo[]=false');
  });

  it('should encode special characters', () => {
    expect(urlfy({'foo bar': 'baz qux'})).toBe('foo%20bar=baz%20qux');
  });

  it('should handle a mix of all types', () => {
    const input = {
      foo: 'bar',
      baz: 123,
      qux: true,
      corge: ['grault', 456, false],
      garply: undefined,
      waldo: null,
    };
    const expected = 'foo=bar&baz=123&qux=true&corge[]=grault&corge[]=456&corge[]=false';
    expect(urlfy(input)).toBe(expected);
  });
});
