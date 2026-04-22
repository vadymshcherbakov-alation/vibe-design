import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {devLogger} from './devLogger';

describe('devLogger', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('in development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should log single string message', () => {
      devLogger('test message');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('test message');
    });

    it('should log multiple arguments', () => {
      devLogger('message', 123, {key: 'value'}, true);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('message', 123, {key: 'value'}, true);
    });

    it('should log with no arguments', () => {
      devLogger();

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith();
    });

    it('should log null and undefined values', () => {
      devLogger(null, undefined);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(null, undefined);
    });

    it('should log complex objects and arrays', () => {
      const obj = {nested: {deep: 'value'}};
      const arr = [1, 'two', {three: 3}];

      devLogger(obj, arr);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(obj, arr);
    });

    it('should log Error objects', () => {
      const error = new Error('test error');

      devLogger(error);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('in test mode (non-production)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should log messages when NODE_ENV is test', () => {
      devLogger('test message');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('test message');
    });
  });

  describe('with undefined NODE_ENV (non-production)', () => {
    beforeEach(() => {
      delete process.env.NODE_ENV;
    });

    it('should log messages when NODE_ENV is undefined', () => {
      devLogger('test message');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('test message');
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should not log messages', () => {
      devLogger('this should not be logged');

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should not log multiple arguments', () => {
      devLogger('message', 123, {key: 'value'}, true);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should not log even with no arguments', () => {
      devLogger();

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('multiple calls', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should log each call separately', () => {
      devLogger('first call');
      devLogger('second call');
      devLogger('third call');

      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenNthCalledWith(1, 'first call');
      expect(consoleSpy).toHaveBeenNthCalledWith(2, 'second call');
      expect(consoleSpy).toHaveBeenNthCalledWith(3, 'third call');
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should handle empty string', () => {
      devLogger('');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('');
    });

    it('should handle zero', () => {
      devLogger(0);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(0);
    });

    it('should handle false', () => {
      devLogger(false);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(false);
    });

    it('should handle Symbol', () => {
      const sym = Symbol('test');

      devLogger(sym);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(sym);
    });

    it('should handle BigInt', () => {
      const bigInt = BigInt(123);

      devLogger(bigInt);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(bigInt);
    });

    it('should handle functions', () => {
      const fn = () => 'test';

      devLogger(fn);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(fn);
    });
  });
});
