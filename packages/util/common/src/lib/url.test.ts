import {isLocalhostHostname, isUrl, resolveNonLocalHost, resolveNonLocalUrl} from './url';

describe('isUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isUrl('https://example.com')).toBe(true);
    expect(isUrl('http://example.com')).toBe(true);
    expect(isUrl('https://www.example.com/path?query=1')).toBe(true);
    expect(isUrl('ftp://example.com')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('not a url')).toBe(false);
    expect(isUrl('just text')).toBe(false);
    expect(isUrl('')).toBe(false);
    expect(isUrl('example.com')).toBe(false); // missing protocol
  });
});

describe('isLocalhostHostname', () => {
  it('should return true for localhost', () => {
    expect(isLocalhostHostname('localhost')).toBe(true);
    expect(isLocalhostHostname('127.0.0.1')).toBe(true);
  });

  it('should return false for non-localhost', () => {
    expect(isLocalhostHostname('example.com')).toBe(false);
    expect(isLocalhostHostname('192.168.1.1')).toBe(false);
  });
});

describe('resolveNonLocalHost', () => {
  it('should return currentHost when not localhost', () => {
    expect(resolveNonLocalHost('https://example.com')).toBe('https://example.com');
    expect(resolveNonLocalHost('https://example.com:8080')).toBe('https://example.com:8080');
  });

  it('should return proxyTarget when on localhost', () => {
    expect(resolveNonLocalHost('http://localhost:3000', 'https://proxy.example.com')).toBe('https://proxy.example.com');
    expect(resolveNonLocalHost('http://127.0.0.1:3000', 'https://proxy.example.com/')).toBe(
      'https://proxy.example.com',
    );
  });

  it('should return undefined when on localhost with no proxy target', () => {
    expect(resolveNonLocalHost('http://localhost:3000')).toBeUndefined();
    expect(resolveNonLocalHost('http://localhost:3000', '')).toBeUndefined();
  });

  it('should handle plain hostname strings', () => {
    expect(resolveNonLocalHost('localhost')).toBeUndefined();
    expect(resolveNonLocalHost('example.com')).toBe('example.com');
  });
});

describe('resolveNonLocalUrl', () => {
  it('should return non-localhost absolute URLs as-is', () => {
    expect(resolveNonLocalUrl('https://example.com/table/123', undefined)).toBe('https://example.com/table/123');
    expect(resolveNonLocalUrl('https://example.com/table/123', 'https://other.com')).toBe(
      'https://example.com/table/123',
    );
  });

  it('should replace localhost host with provided host', () => {
    expect(resolveNonLocalUrl('http://localhost:3000/table/123', 'https://example.com')).toBe(
      'https://example.com/table/123',
    );
    expect(resolveNonLocalUrl('http://127.0.0.1:8080/table/123', 'https://example.com')).toBe(
      'https://example.com/table/123',
    );
  });

  it('should strip localhost to relative path when no host available', () => {
    expect(resolveNonLocalUrl('http://localhost:3000/table/123', undefined)).toBe('/table/123');
  });

  it('should prepend host to relative URLs', () => {
    expect(resolveNonLocalUrl('/table/123', 'https://example.com')).toBe('https://example.com/table/123');
  });

  it('should return relative URLs as-is when no host available', () => {
    expect(resolveNonLocalUrl('/table/123', undefined)).toBe('/table/123');
  });
});
