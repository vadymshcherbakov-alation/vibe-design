export const alphaNumericRegex = /^[\w\s\p{L}\p{N}]+$/u;

export const isAlphanumeric = (str: string) => {
  return alphaNumericRegex.test(str);
};
