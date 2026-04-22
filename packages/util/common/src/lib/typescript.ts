/**
 * Utility type to generate dot-notation paths for a given type.
 * Uses depth limiting and skips string index signatures to prevent
 * infinite union type expansion (TS2590 error).
 *
 * @param T - The type to generate paths for
 * @param Prefix - Internal prefix for building paths (do not set manually)
 * @param Depth - Internal depth counter to limit recursion (do not set manually)
 */
export type DotNotationPaths<
  T,
  Prefix extends string = '',
  Depth extends readonly unknown[] = readonly [],
> = Depth['length'] extends 5
  ? never // Limit recursion depth to prevent infinite type expansion
  : T extends object
    ? {
        readonly [K in keyof T & string as string extends K ? never : K]:
          | `${Prefix}${K}`
          | DotNotationPaths<T[K], `${Prefix}${K}.`, readonly [...Depth, unknown]>;
      }[keyof T & string extends infer U extends string ? (string extends U ? never : U) : never]
    : never;
