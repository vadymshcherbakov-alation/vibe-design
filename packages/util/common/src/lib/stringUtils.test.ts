import {bytesToHex} from './stringUtils';

describe('stringUtils', () => {
  describe(bytesToHex, () => {
    it('should convert Uint8Array to a hexadecimal string', () => {
      const input = new Uint8Array([0, 1, 255, 254]);
      const result = bytesToHex(input);
      expect(result).toBe('0001fffe');
    });

    it('should handle an empty Uint8Array', () => {
      const input = new Uint8Array(0);
      const result = bytesToHex(input);
      expect(result).toBe('');
    });
  });
});
