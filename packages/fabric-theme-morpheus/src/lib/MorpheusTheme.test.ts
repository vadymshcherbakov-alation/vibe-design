import {fabricThemeMorpheus} from '../index';

describe('fabricThemeMorpheus', () => {
  it('should use the correct spacing', () => {
    expect(fabricThemeMorpheus.spacing(1)).toBe('0.8rem');
  });
});
