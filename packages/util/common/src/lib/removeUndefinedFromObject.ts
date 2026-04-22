export function removeUndefinedFromObject<T extends object>(obj: T) {
  Object.keys(obj).forEach((key) => {
    const current = (obj as never)[key];
    if (current === undefined) {
      delete (obj as never)[key];
    } else if (typeof current === 'object' && Object.entries(current).length) {
      removeUndefinedFromObject(current);
    }
  });

  return obj;
}
