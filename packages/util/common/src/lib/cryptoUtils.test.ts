import {generateRandomHex, generateRandomHexSecure} from './cryptoUtils';

describe('cryptoUtils', () => {
  const isValidHex = (str: string): boolean => /^[0-9a-f]*$/.test(str);
  const hasLength = (str: string, expectedLength: number): boolean => str.length === expectedLength;
  const expectValidHex = (result: string, length: number) => {
    expect(result).toEqual(expect.any(String));
    expect(hasLength(result, length)).toBe(true);
    expect(isValidHex(result)).toBe(true);
  };

  describe(generateRandomHex, () => {
    describe('valid inputs', () => {
      it('should generate 8-character hex string', () => {
        const result = generateRandomHex(8);
        expectValidHex(result, 8);
      });

      it('should generate 1-character hex string', () => {
        const result = generateRandomHex(1);
        expectValidHex(result, 1);
      });

      it('should generate 32-character hex string (max length)', () => {
        const result = generateRandomHex(32);
        expectValidHex(result, 32);
      });

      it('should generate 16-character hex string', () => {
        const result = generateRandomHex(16);
        expectValidHex(result, 16);
      });
    });

    describe('uniqueness', () => {
      it('should generate different values on subsequent calls', () => {
        const result1 = generateRandomHex(8);
        const result2 = generateRandomHex(8);
        expect(result1).not.toBe(result2);
      });

      it('should generate unique values across multiple calls', () => {
        const results = Array.from({length: 10}, () => generateRandomHex(8));
        const uniqueResults = new Set(results);
        expect(uniqueResults.size).toBe(results.length);
      });
    });

    describe('error conditions', () => {
      it('should throw error for zero length', () => {
        expect(() => generateRandomHex(0)).toThrow('Length must be a positive number');
      });

      it('should throw error for negative length', () => {
        expect(() => generateRandomHex(-1)).toThrow('Length must be a positive number');
      });

      it('should throw error for length exceeding UUID limit', () => {
        expect(() => generateRandomHex(33)).toThrow('Length cannot exceed 32 characters (UUID limit)');
      });

      it('should throw error for very large length', () => {
        expect(() => generateRandomHex(100)).toThrow('Length cannot exceed 32 characters (UUID limit)');
      });
    });
  });

  describe(generateRandomHexSecure, () => {
    describe('valid inputs', () => {
      it('should generate 8-character hex string', () => {
        const result = generateRandomHexSecure(8);
        expectValidHex(result, 8);
      });

      it('should generate 1-character hex string', () => {
        const result = generateRandomHexSecure(1);
        expectValidHex(result, 1);
      });

      it('should generate 32-character hex string', () => {
        const result = generateRandomHexSecure(32);
        expectValidHex(result, 32);
      });

      it('should generate 64-character hex string (beyond UUID limit)', () => {
        const result = generateRandomHexSecure(64);
        expectValidHex(result, 64);
      });

      it('should generate odd-length hex string', () => {
        const result = generateRandomHexSecure(7);
        expectValidHex(result, 7);
      });
    });

    describe('uniqueness', () => {
      it('should generate different values on subsequent calls', () => {
        const result1 = generateRandomHexSecure(8);
        const result2 = generateRandomHexSecure(8);
        expect(result1).not.toBe(result2);
      });

      it('should generate unique values across multiple calls', () => {
        const results = Array.from({length: 10}, () => generateRandomHexSecure(8));
        const uniqueResults = new Set(results);
        expect(uniqueResults.size).toBe(results.length);
      });
    });

    describe('error conditions', () => {
      it('should throw error for zero length', () => {
        expect(() => generateRandomHexSecure(0)).toThrow('Length must be a positive number');
      });

      it('should throw error for negative length', () => {
        expect(() => generateRandomHexSecure(-1)).toThrow('Length must be a positive number');
      });
    });
  });

  describe('comparison between implementations', () => {
    it('should both generate valid hex of same length', () => {
      const length = 8;
      const result1 = generateRandomHex(length);
      const result2 = generateRandomHexSecure(length);

      expectValidHex(result1, length);
      expectValidHex(result2, length);
      expect(result1).not.toBe(result2);
    });

    it('should both work for various common lengths', () => {
      const lengths = [4, 8, 12, 16, 24, 32];

      lengths.forEach((length) => {
        const result1 = generateRandomHex(length);
        const result2 = generateRandomHexSecure(length);

        expectValidHex(result1, length);
        expectValidHex(result2, length);
      });
    });
  });
});
