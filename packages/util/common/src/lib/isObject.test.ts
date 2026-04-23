import {isObject} from './isObject';
import {noop} from './noop';

describe(isObject, () => {
  it('should return true for an object', () => {
    expect(isObject({})).toBe(true);
  });
  it('should return true for a function', () => {
    expect(isObject(noop)).toBe(true);
  });
  it('should return true for an array', () => {
    expect(isObject([0, 1, 2])).toBe(true);
  });
  it('should return true for a regex', () => {
    expect(isObject(/abc/g)).toBe(true);
  });
  it('should return true for a Number', () => {
    expect(isObject(new Number(0))).toBe(true);
  });
  it('should return true for a String', () => {
    expect(isObject(new String('foo'))).toBe(true);
  });

  it('should return false for a string', () => {
    expect(isObject('foo')).toBe(false);
  });
  it('should return false for a number', () => {
    expect(isObject(1)).toBe(false);
  });
  it('should return false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });
  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });
  it('should return false for NaN', () => {
    expect(isObject(NaN)).toBe(false);
  });
});
