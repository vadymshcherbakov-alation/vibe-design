import {uniqueId} from './uniqueId';

describe(uniqueId, () => {
  it('should return a unique id without a prefix', () => {
    expect(uniqueId()).toBe('1');
  });
  it('should return a new unique id without a prefix', () => {
    expect(uniqueId()).toBe('2');
  });
  it('should return a unique id with a prefix', () => {
    expect(uniqueId('hello_')).toBe('hello_1');
  });
  it('should return a new unique id with a prefix', () => {
    expect(uniqueId('hello_')).toBe('hello_2');
  });
});
