import {getContrastScore, getShellDrawerColor, isContrastWcagAaaCompliant, isContrastWcagAaCompliant} from './color';

describe('color utilities', () => {
  describe(getContrastScore, () => {
    it('should return known value for blue and white', () => {
      expect(getContrastScore('#0000FF', '#ffffff')).toBe(8.592471358428805);
      expect(getContrastScore('#00416b', '#f16923')).toBe(3.446943987112935);
      expect(getContrastScore('#00416b', '#ffffff')).toBe(10.66842201649027);
      expect(getContrastScore(getShellDrawerColor('#00416b'), '#ffffff')).toBe(8.848622746867983);
    });
  });
  describe(isContrastWcagAaCompliant, () => {
    it('should return true for our shell color with text', () => {
      expect(isContrastWcagAaCompliant('#00416b', '#ffffff')).toBe(true);
    });
    it('should return true with our shell drawer color and text', () => {
      expect(isContrastWcagAaCompliant(getShellDrawerColor('#00416b'), '#ffffff')).toBe(true);
    });
  });
  describe(isContrastWcagAaaCompliant, () => {
    it('should return true for our shell color with text', () => {
      expect(isContrastWcagAaaCompliant('#00416b', '#ffffff')).toBe(true);
    });
  });
});
