/**
 * TTL needs to be lower for tests so cached results don't impact
 * subsequent tests
 */
const DEFAULT_TTL = process.env.NODE_ENV === 'test' ? 5 : 300000;

export const ResponseCache = <T>({ ttl = DEFAULT_TTL }: { ttl?: number }) => {
  let cachedResponse = {};
  let respStatus = {};

  const getAll = () => cachedResponse;

  const getValue = (requestKey: string) => {
    const response = cachedResponse[requestKey];
    const responseStatus = respStatus[requestKey];
    if (typeof response === 'undefined') {
      // Check if there is already a value being resolved
      if (typeof responseStatus !== 'undefined') {
        throw new Error(`Request inflight ${requestKey}`);
      }

      throw new ReferenceError(`Cache miss ${requestKey}`);
    }

    return response;
  }

  const abortResolvingValue = (requestKey: string) => {
    delete respStatus[requestKey];
  }

  const clear = () => {
    cachedResponse = {};
    respStatus = {};
  }

  const setValue = (requestKey: string, response: T | Promise<T>) => {
    delete respStatus[requestKey];
    cachedResponse[requestKey] = response;

    // Auto delete cached reponse after ttl period
    setTimeout(() => {
      if (typeof cachedResponse[requestKey] !== 'undefined') {
        delete cachedResponse[requestKey];
      }
    }, ttl);

    return response;
  }

  const startResolvingValue = (requestKey: string) => {
    respStatus[requestKey] = true;
  }

  return {
    abortResolvingValue,
    clear,
    getAll,
    getValue,
    setValue,
    startResolvingValue,
  }
}
