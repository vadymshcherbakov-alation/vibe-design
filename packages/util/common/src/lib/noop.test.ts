import {noop} from './noop';

describe(noop, () => {
  it('should accept arguments return undefined', () => {
    expect(noop(123)).toBe(undefined);
  });
  it('should accept no arguments and return undefined', () => {
    expect(noop()).toBe(undefined);
  });
});
