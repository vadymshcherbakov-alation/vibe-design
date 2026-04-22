export function makeRecordCountKey(skip: number, limit: number): string {
  return `${skip}-${limit}`;
}
