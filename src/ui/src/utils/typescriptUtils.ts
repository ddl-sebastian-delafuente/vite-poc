export type UnionTypes = string | number | symbol;

/**
 * Utility type that constrains a map based off a Union
 * this is an alternative to using Enums.
 *
 * @example
 * export type StringUnion = 'hello' | 'world';
 * export const StringUnion: UnionToMap<StringUnion> = {
 *   hello: 'hello',
 *   world: 'world'
 * }
 *
 * interface ExampleIterface {
 *   nestedUnion: 'hello' | 'world';
 * }
 * export type NestedUnion = ExampleInterface['nestedUion'];
 * export const NestedUnion: UnionToMap<NestedUnion> = {
 *   hello: 'hello',
 *   world: 'world'
 * }
 */
export type UnionToMap<U extends UnionTypes> = { [T in U]: U };

// Pulled from TS sourcecode remove once TS version is > 4.5
export type Awaited<T> =
      T extends null | undefined ? T : // special case for `null | undefined` when not in `--strictNullChecks` mode
          // eslint-disable-next-line @typescript-eslint/ban-types
          T extends object & { then(onfulfilled: infer F): any  } ? // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
              F extends ((value: infer V) => any) ? // if the argument to `then` is callable, extracts the argument
                  Awaited<V> : // recursively unwrap the value
                  never : // the argument to `then` was not callable
        T; // non-object or non-thenable
