import {isAlphanumeric} from './isAlphanumeric';

describe(isAlphanumeric, () => {
  it.each([
    [{value: 'abc(', expected: false}],
    [{value: 'abc1', expected: true}],
    [{value: '', expected: false}],
    [{value: 'abc abc', expected: true}],
    [{value: 'こんにちは123 ٧٨٩', expected: true}],
    [{value: '私のコードでもこれを理解できる', expected: true}],
    [{value: 'ABCddd こんにちは123 ٧٨٩', expected: true}],
    [{value: 'ABCddd ---', expected: false}],
    [{value: '"ABCddd"', expected: false}],
    [{value: '<ABCddd?', expected: false}],
  ])('should return $expected when $value', ({value, expected}: {expected: boolean; value: string}) => {
    expect(isAlphanumeric(value)).toBe(expected);
  });
});
