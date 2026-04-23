export function parseJSON<T>(value: string | null): T | undefined {
  try {
    // NOTE: We should prevent any code that generates a query param of 'undefined'
    return typeof value === 'undefined' || value === null || value === 'undefined' ? undefined : JSON.parse(value);
  } catch {
    console.log('parsing error on', {value});
    return undefined;
  }
}
