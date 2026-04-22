/**
 * Format the given number of bytes into a human-readable string representation.
 *
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimals to round the result (default: 2).
 * @returns A string representing the formatted byte size.
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 B';
  if (bytes < 0 || !bytes || isNaN(bytes)) {
    throw new RangeError('Bytes should be greater than or equal to 0(zero)');
  }

  const k = 1000; // The base value for calculating kilobytes, megabytes, etc.
  const decimalPlaces = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  // Calculate the appropriate size unit (KB, MB, GB, TB) based on the number of bytes
  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(k));

  // Calculate the size in the appropriate unit with the desired number of decimals
  const formattedSize = (bytes / Math.pow(k, sizeIndex)).toFixed(decimalPlaces);

  return `${formattedSize} ${sizes[sizeIndex]}`;
};
