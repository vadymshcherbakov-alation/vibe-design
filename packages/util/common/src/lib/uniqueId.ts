const idCounter: Record<string, number> = {};

export function uniqueId(prefix = '$fabric$') {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0;
  }

  const id = ++idCounter[prefix];
  if (prefix === '$fabric$') {
    return `${id}`;
  }

  return `${prefix}${id}`;
}
