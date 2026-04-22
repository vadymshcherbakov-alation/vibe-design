/**
 * Generates a random hex string of the specified length.
 *
 * @param length - The number of hex characters to generate (1-32)
 * @returns A lowercase hex string of the specified length
 *
 * @example
 * ```typescript
 * generateRandomHex(8)  // "a1b2c3d4"
 * generateRandomHex(16) // "1a2b3c4d5e6f7890"
 * ```
 */
export function generateRandomHex(length: number): string {
  if (length <= 0) {
    throw new Error('Length must be a positive number');
  }

  if (length > 32) {
    throw new Error('Length cannot exceed 32 characters (UUID limit)');
  }

  return crypto.randomUUID().replace(/-/g, '').slice(0, length);
}

/**
 * Generates a random hex string of the specified length using crypto.getRandomValues.
 * Alternative implementation that doesn't rely on UUID format and has no length limit.
 *
 * @param length - The number of hex characters to generate
 * @returns A lowercase hex string of the specified length
 *
 * @example
 * ```typescript
 * generateRandomHexSecure(8)  // "f3a7b9c2"
 * generateRandomHexSecure(64) // "4d8e2f1a5c7b..." (64 chars)
 * ```
 */
export function generateRandomHexSecure(length: number): string {
  if (length <= 0) {
    throw new Error('Length must be a positive number');
  }

  const bytes = crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2)));
  const hex = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hex.slice(0, length);
}
