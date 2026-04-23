import {capitalize} from './capitalize';

describe(capitalize, () => {
  it('should work with empty string', () => {
    expect(capitalize('')).toBe('');
  });
  it('should work with 1 letter', () => {
    expect(capitalize('a')).toBe('A');
  });
  it('should work with more than 1 letter', () => {
    expect(capitalize('aaaaaaa')).toBe('Aaaaaaa');
  });
  it('should work with numeric strings', () => {
    expect(capitalize('1a')).toBe('1a');
  });
});
