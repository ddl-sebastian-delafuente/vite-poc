/**
 * Key lookup in objects
 * @param cases
 */
export const switchCase = (cases: object) =>
  (defaultValue: object | string | number) => (key: string | number) => cases[key] || defaultValue;
