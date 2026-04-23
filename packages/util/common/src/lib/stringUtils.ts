export function truncateStringByCharacter(string: string, characterLength: number): string {
  if (!string) {
    return '';
  }

  if (string.length > characterLength) {
    return addEllipsis(string.substring(0, characterLength));
  }
  return string;
}

export function addEllipsis(string: string): string {
  return `${string}...`;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function generateUniqueSessionId(): string {
  const now = new Date().toISOString();
  const randomValues = new Uint8Array(16);
  window.crypto.getRandomValues(randomValues);

  const randomHex = bytesToHex(randomValues);
  return `${now}#${randomHex}`;
}

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

/**
 * Converts a machine name (with underscores) to a human-readable display name
 * Uses title case (capitalizes each word) to maintain consistency with existing behavior
 */
export const getDisplayNameFromMachineName = (machineName: string): string => {
  return machineName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};
