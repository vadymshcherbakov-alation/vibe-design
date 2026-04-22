import {timezoneUtils} from './TimezoneUtils';

describe('TimezoneUtils', () => {
  describe('convert_crontab_to_different_timezone', () => {
    it('at 15th minute every hour, server in PST while browser in EST', async () => {
      const serverCrontab = '15 * * * *';
      const browserCrontab = timezoneUtils.adjustCrontab(serverCrontab, 180);
      expect(browserCrontab).toBe('15 * * * *');
    });

    it('7:30pm every day, server in PST while browser in EST', async () => {
      const serverCrontab = '30 19 * * *';
      const browserCrontab = timezoneUtils.adjustCrontab(serverCrontab, 180);
      expect(browserCrontab).toBe('30 22 * * *');
    });

    it('9:30pm every Sunday, server in PST while browser in EST', async () => {
      const serverCrontab = '30 21 * * 0';
      const browserCrontab = timezoneUtils.adjustCrontab(serverCrontab, 180);
      expect(browserCrontab).toBe('30 0 * * 1');
    });

    it('9:33pm on 30th every month, server in PST while browser in China Standard time', async () => {
      const serverCrontab = '33 9 30 * *';
      const browserCrontab = timezoneUtils.adjustCrontab(serverCrontab, 960);
      expect(browserCrontab).toBe('33 1 31 * *');
    });

    it('4:35pm on 31th every month, server in PST while browser in India time', async () => {
      const serverCrontab = '35 16 31 * *';
      const browserCrontab = timezoneUtils.adjustCrontab(serverCrontab, 810);
      expect(browserCrontab).toBe('5 6 1 * *');
    });

    it('2:35am every Tuesday, server in EST while browser in PST', async () => {
      const serverCrontab = '35 2 * * 2';
      const browserCrontab = timezoneUtils.adjustCrontab(serverCrontab, -180);
      expect(browserCrontab).toBe('35 23 * * 1');
    });
  });

  describe('Crontab adjustments', () => {
    it('Shift forward by 128 minutes, to next day of week', async () => {
      const crontab = '52 23 * * 6';
      const res = timezoneUtils.adjustCrontab(crontab, 128);
      expect(res).toBe('0 2 * * 0');
    });

    it('Shift forward by 128 minutes, to next day of month', async () => {
      const crontab = '52 23 5 * *';
      const res = timezoneUtils.adjustCrontab(crontab, 128);
      expect(res).toBe('0 2 6 * *');
    });

    it('change minute', async () => {
      const crontab = '0 * * * *';
      const res = timezoneUtils.adjustCrontabMinute(crontab, 30);
      expect(res).toBe('30 * * * *');
    });

    it('change hour', async () => {
      const crontab = '* 1 * * *';
      const res = timezoneUtils.adjustCrontabHour(crontab, 22);
      expect(res).toBe('* 22 * * *');
    });

    it('change day of week', async () => {
      const crontab = '* * * * 4';
      const res = timezoneUtils.adjustCrontabDayOfWeek(crontab, 1);
      expect(res).toBe('* * * * 1');
    });

    it('change day of month', async () => {
      const crontab = '* * 2 * *';
      const res = timezoneUtils.adjustCrontabDayOfMonth(crontab, 25);
      expect(res).toBe('* * 25 * *');
    });
  });

  describe('get timezone utc offset', () => {
    it('should get offset of IST correctly', async () => {
      const timezone = 'Asia/Calcutta';
      const res = timezoneUtils.getTzUtcOffset(timezone);
      expect(res).toBe(330);
    });
  });
});
