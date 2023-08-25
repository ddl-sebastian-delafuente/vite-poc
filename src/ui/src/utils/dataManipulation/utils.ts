import * as R from 'ramda';

/**
 * Creates a getter for a map which returns a default value if nothing is found
 * in the original map
 *
 * @param defaultTo - value to return if nothing found in base map
 * @param map - the base map of key value pairs to look stuff up in
 * @returns T|D - the default value or a value found in the map
 */
export function createMapWithDefault<D, T>(defaultTo: D, map: { [key: string]: T }): (key: string) => T | D {
  const defaulter = R.defaultTo(defaultTo);
  return (key: string) => defaulter(map[key]);
}

/**
 * Compares strings, case insensitive. Used for sorting arrays of string
 */
export const stringComparer = <T>(getter: (s: T) => string | undefined) => (a: T, b: T) => {
  const left = getter(a);
  const right = getter(b);

  if (R.isNil(left) || typeof left!.toLowerCase !== 'function') {
    return 1;
  }
  if (R.isNil(right) || typeof right!.toLowerCase !== 'function') {
    return -1;
  }

  const leftInLowerCase = left!.toLowerCase();
  const rightInLowerCase = right!.toLowerCase();

  if (leftInLowerCase > rightInLowerCase) {
    return 1;
  }
  if (leftInLowerCase < rightInLowerCase) {
    return -1;
  }
  return 0;
};

/**
 * Compares numbers. Used for sorting arrays of numbers
 */
export const numberComparer = <T>(getter: (s: T) => number | undefined) => (a: T, b: T) => {
  const left = getter(a);
  const right = getter(b);

  if (R.isNil(left)) {
    return 1;
  }
  if (R.isNil(right)) {
    return -1;
  }
  return left - right;
};
