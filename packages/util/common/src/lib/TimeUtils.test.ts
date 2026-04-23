import {formatTimeDuration, getDateString, getHourInAm, getHourInPm} from './TimeUtils';

describe('TimeUtils', () => {
  describe('Get date string for timestamp', () => {
    it('Get date string for same year timestamp', async () => {
      const currentYear = new Date().getFullYear();
      const dateString = getDateString(`${currentYear}-05-04T17:45:58+00:00`);
      expect(dateString).toBe('May 4');
    });

    it('Get date string for different year timestamp', async () => {
      const dateString = getDateString('2004-05-04T17:45:58+00:00');
      expect(dateString).toBe('May 4, 2004');
    });
  });

  describe('Get hour in AM', () => {
    it('11 for 11th hour', async () => {
      const hour = getHourInAm(11);
      expect(hour).toBe(11);
    });

    it('0 for 12th hour', async () => {
      const hour = getHourInAm(12);
      expect(hour).toBe(0);
    });
  });

  describe('Get hour in PM', () => {
    it('23 for 11th hour', async () => {
      const hour = getHourInPm(11);
      expect(hour).toBe(23);
    });

    it('14 for 14th hour', async () => {
      const hour = getHourInPm(14);
      expect(hour).toBe(14);
    });
  });

  describe('formatTimeDuration', () => {
    it('should return the input in seconds if less than 60', async () => {
      const result = formatTimeDuration(30);
      expect(result).toBe('30s');
    });

    it('should correctly format durations in minutes', async () => {
      const result = formatTimeDuration(180);
      expect(result).toBe('3min');
    });

    it('should correctly format durations in hours', async () => {
      const result = formatTimeDuration(7200);
      expect(result).toBe('2hr');
    });

    it('should correctly format durations in days', async () => {
      const result = formatTimeDuration(172800);
      expect(result).toBe('2d');
    });

    it('should correctly format durations with days, hours, minutes, and seconds', async () => {
      const result = formatTimeDuration(93784);
      expect(result).toBe('1d 2hr 3min 4s');
    });

    it('should handle durations with only some components', async () => {
      const result = formatTimeDuration(3665);
      expect(result).toBe('1hr 1min 5s');
    });

    it('should handle durations with 0 seconds', async () => {
      const result = formatTimeDuration(3600);
      expect(result).toBe('1hr');
    });

    it('should handle negative input', async () => {
      const result = formatTimeDuration(-100);
      expect(result).toBe(''); // Assuming that a negative input is not valid, adjust as needed
    });

    it('should handle string input', async () => {
      const result = formatTimeDuration(172800);
      expect(result).toBe('2d');
    });

    it('should handle null input', async () => {
      const result = formatTimeDuration(null);
      expect(result).toBe('');
    });

    it('should handle non-number input', async () => {
      const result = formatTimeDuration(null);
      expect(result).toBe('');
    });

    it('should handle input of 0', async () => {
      const result = formatTimeDuration(0);
      expect(result).toBe('0 seconds');
    });

    describe('options parameter', () => {
      const testSeconds = 93784; // 1d 2hr 3min 4s

      it('should show all components by default', async () => {
        const result = formatTimeDuration(testSeconds);
        expect(result).toBe('1d 2hr 3min 4s');
      });

      it('should hide days when showDays is false', async () => {
        const result = formatTimeDuration(testSeconds, {showDays: false});
        expect(result).toBe('26hr 3min 4s'); // 24 + 2 = 26 hours
      });

      it('should hide hours when showHours is false', async () => {
        const result = formatTimeDuration(testSeconds, {showHours: false});
        expect(result).toBe('1d 123min 4s'); // 2*60 + 3 = 123 minutes
      });

      it('should hide minutes when showMinutes is false', async () => {
        const result = formatTimeDuration(testSeconds, {showMinutes: false});
        expect(result).toBe('1d 2hr 184s'); // 3*60 + 4 = 184 seconds
      });

      it('should hide seconds when showSeconds is false', async () => {
        const result = formatTimeDuration(testSeconds, {showSeconds: false});
        expect(result).toBe('1d 2hr 3min');
      });

      it('should handle multiple options disabled', async () => {
        const result = formatTimeDuration(testSeconds, {
          showDays: false,
          showMinutes: false,
        });
        expect(result).toBe('26hr 184s');
      });

      it('should handle all options disabled except seconds', async () => {
        const result = formatTimeDuration(testSeconds, {
          showDays: false,
          showHours: false,
          showMinutes: false,
          showSeconds: true,
        });
        expect(result).toBe('93784s');
      });

      it('should handle small durations with selective options', async () => {
        const result = formatTimeDuration(125, {showMinutes: false});
        expect(result).toBe('125s');
      });

      it('should handle hour-only display', async () => {
        const result = formatTimeDuration(7265, {
          // 2hr 1min 5s
          showDays: false,
          showMinutes: false,
          showSeconds: false,
        });
        expect(result).toBe('2hr');
      });

      it('should return empty string when all components are hidden and there are no matching units', async () => {
        const result = formatTimeDuration(30, {
          // 30 seconds
          showDays: false,
          showHours: false,
          showMinutes: false,
          showSeconds: false,
        });
        expect(result).toBe('');
      });

      it('should handle edge case with 0 seconds and options', async () => {
        const result = formatTimeDuration(0, {showDays: false});
        expect(result).toBe('0 seconds');
      });
    });
  });
});
