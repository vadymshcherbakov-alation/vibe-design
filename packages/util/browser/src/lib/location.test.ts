// test should allow hostnames
import {getHostAndPort, getUriFromPath, shouldAllowHostname} from './location';

describe('location', () => {
  describe(getHostAndPort, () => {
    describe('when hostname is localhost with port', () => {
      it('should work with localhost, http, :4200', () => {
        vi.stubGlobal('location', {hostname: 'localhost', port: '4200', protocol: 'http:'});
        expect(getHostAndPort()).toBe('http://localhost:4200');
      });

      it('should work with example.com, https, port 80', () => {
        vi.stubGlobal('location', {hostname: 'example.com', port: '', protocol: 'https:'});
        expect(getHostAndPort()).toBe('https://example.com');
      });
    });
  });

  describe(getUriFromPath, () => {
    it('should return the full URI with https and example.com', () => {
      vi.stubGlobal('location', {protocol: 'https:', hostname: 'example.com', port: ''});
      expect(getUriFromPath('/path/to/resource')).toBe('https://example.com/path/to/resource');
    });

    it('should return the full URI with http, port 4200 and localhost', () => {
      vi.stubGlobal('location', {protocol: 'http:', hostname: 'localhost', port: '4200'});
      expect(getUriFromPath('/path/to/resource')).toBe('http://localhost:4200/path/to/resource');
    });
  });

  describe(shouldAllowHostname, () => {
    const list = [
      '127.0.0.1',
      'localhost',
      // alpha sorted
      'aaa.alationcloud.com',
      'nttdocomo.ap.alationcloud.com',
      'zeus-uat-ap-ga.ap.alationcloud.com',
      'zeus-uat-eu-ga.eu.alationcloud.com',
      'zeus-uat-eu-west-1-ga.eu.alationcloud.com',
      'zeus-uat-eu-west-1-ga.eu.alationcloud.com',
      'zeus-uat-ga-canada-cac1.ca.alationcloud.com',
      'zeus-uat-ga-tokyo.ap.alationcloud.com',
      'zeus-uat-us-west2-ga.alationcloud.com',
      'mtdev.alationcloud.com',
      'mtqa.alationcloud.com',
      'mtse.alationcloud.com',
    ];
    it('should return true for empty list', () => {
      expect(shouldAllowHostname([], 'localhost')).toBe(true);
    });
    it('should return true for localhost', () => {
      expect(shouldAllowHostname(list, 'localhost')).toBe(true);
    });
    it('should return true for aaa.alationcloud.com', () => {
      expect(shouldAllowHostname(list, 'nttdocomo.ap.alationcloud.com')).toBe(true);
    });
    it('should return true for a partial match', () => {
      expect(shouldAllowHostname(['alationcloud.com'], 'aaa.alationcloud.com')).toBe(true);
    });
    it('should return false for a non-match', () => {
      expect(shouldAllowHostname(['alationcloud.net'], 'aaa.alationcloud.com')).toBe(false);
    });
  });
});
