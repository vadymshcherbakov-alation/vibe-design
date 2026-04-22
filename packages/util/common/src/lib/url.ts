export function isUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a hostname is localhost or 127.0.0.1.
 */
export function isLocalhostHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Resolve the non-local host to use for generated URLs.
 *
 * @param currentHost - The current host string (e.g. `https://example.com:8080`)
 * @param proxyTarget - Optional proxy target for local development (e.g. `NX_PROXY_TARGET`)
 * @returns The resolved host, or undefined when on localhost with no proxy target
 */
export function resolveNonLocalHost(currentHost: string, proxyTarget?: string): string | undefined {
  try {
    const parsed = new URL(currentHost);
    if (!isLocalhostHostname(parsed.hostname)) {
      return currentHost;
    }
  } catch {
    if (!isLocalhostHostname(currentHost)) {
      return currentHost;
    }
  }

  return proxyTarget?.replace(/\/$/, '') || undefined;
}

/**
 * Ensure a URL never contains localhost. Handles absolute, relative, and localhost-based URLs.
 *
 * - Absolute URL with non-localhost host: returned as-is.
 * - Absolute URL with localhost host: host is replaced with the provided host, or stripped to a
 *   relative path when no host is available.
 * - Relative URL (e.g. `/table/123`): the host is prepended, or the path is returned
 *   as-is when no host is available.
 *
 * @param url - An absolute or relative URL
 * @param host - The resolved non-local host (output of `resolveNonLocalHost`, or a known host string)
 * @returns A URL that never includes localhost
 */
export function resolveNonLocalUrl(url: string, host: string | undefined): string {
  try {
    const parsed = new URL(url);
    if (isLocalhostHostname(parsed.hostname)) {
      return host ? `${host}${parsed.pathname}` : parsed.pathname;
    }
    return url;
  } catch {
    return host ? `${host}${url}` : url;
  }
}
