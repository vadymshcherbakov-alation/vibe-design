import {
  resolveNonLocalHost as resolveNonLocalHostBase,
  resolveNonLocalUrl as resolveNonLocalUrlBase,
} from '@alation/util';

/**
 * Build the host and port of the current window location.
 */
export function getHostAndPort(): string {
  const {hostname, protocol, port} = window.location;
  return `${protocol}//${hostname}${port && `:${port}`}`;
}

/**
 * Returns the full URI for a given path within the context of the current browser location.
 * @param path The path starting with a leading slash
 */
export function getUriFromPath(path: `/${string}`): string {
  const absolutePath = path.startsWith('/') ? path : `/${path}`;
  return `${getHostAndPort()}${absolutePath}`;
}

/**
 * Checks if the current hostname is allowed based on a list of allowed hostnames.
 * @param list The list of allowed hostnames. If empty, all hostnames are allowed.
 * @param hostname (defaults to the current window location hostname)
 */
export function shouldAllowHostname(list: readonly string[], hostname = window.location.hostname): boolean {
  return list.length === 0 || list.some((allowedHostname) => hostname.includes(allowedHostname));
}

/**
 * Browser convenience wrapper for resolveNonLocalHost.
 * Reads the current host from `window.location` and proxy target from `NX_PROXY_TARGET`.
 */
export function resolveNonLocalHost(): string | undefined {
  return resolveNonLocalHostBase(getHostAndPort(), process.env['NX_PROXY_TARGET']);
}

/**
 * Browser convenience wrapper for resolveNonLocalUrl.
 * Automatically resolves the host from `window.location`.
 */
export function resolveNonLocalUrl(url: string): string {
  return resolveNonLocalUrlBase(url, resolveNonLocalHost());
}
