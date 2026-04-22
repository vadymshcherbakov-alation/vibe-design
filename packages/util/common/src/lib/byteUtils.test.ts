import {formatBytes} from './byteUtils';

describe('formatBytes', () => {
  it('should return "0 B" for 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('should throw a RangeError for negative bytes', () => {
    expect(() => formatBytes(-100)).toThrow(RangeError);
  });

  it('should throw a RangeError for NaN input', () => {
    expect(() => formatBytes(NaN)).toThrow(RangeError);
  });

  it('should return "1.00 KB" for 1000 bytes with default decimals', () => {
    expect(formatBytes(1000)).toBe('1.00 KB');
  });

  it('should return "1.50 MB" for 1500000 bytes with 2 decimals', () => {
    expect(formatBytes(1.5 * 1000 * 1000, 2)).toBe('1.50 MB');
  });

  it('should return "1.005 GB" for 1005000000 bytes with 3 decimals', () => {
    expect(formatBytes(1.005 * 1000 * 1000 * 1000, 3)).toBe('1.005 GB');
  });

  it('should return "1 TB" for 1100000000000 bytes with 0 decimals', () => {
    expect(formatBytes(1.1 * 1000 * 1000 * 1000 * 1000, 0)).toBe('1 TB');
  });
});
