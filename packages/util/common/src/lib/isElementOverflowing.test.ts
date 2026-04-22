import {isElementOverflowing} from './isElementOverflowing';

describe(isElementOverflowing, () => {
  it('should return true of scrollWidth is larger than clientWidth', () => {
    expect(isElementOverflowing({scrollWidth: 1, clientWidth: 0} as Element)).toBe(true);
  });
  it('should return false of scrollWidth equal or less than clientWidth', () => {
    expect(isElementOverflowing({scrollWidth: 0, clientWidth: 1} as Element)).toBe(false);
    expect(isElementOverflowing({scrollWidth: 1, clientWidth: 1} as Element)).toBe(false);
  });
});
