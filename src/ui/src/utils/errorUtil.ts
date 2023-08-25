import { pathOr, is } from 'ramda';

export type ErrorResponse = {
  body: {
    text: () => Promise<string>;
    json: () => Promise<{}>;
  };
};

export function getErrorMessage(error: any): Promise<string> {
  if (!!error.body) {
    return error.body.text()
    .then((body: any) => {
      // we actually don't know what this will deserialize to
      // we need to standardize error messaging
      let parsed = body;
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        console.warn('could not parse body as json', e);
      }

      if (is(String, parsed.message)) {
        return parsed.message;
      }

      if (is(String, parsed)) {
        return parsed;
      }

      return Promise.reject(error);
    })
    .catch(() => {
      // something went wrong when deserializing the body
      // fallback gracefully
      console.error('Failed to deserialize error message.');
      return Promise.reject(error);
    });
  } else if (pathOr(false, ['response', 'data'], error)) {
    const { data } = error.response;
    if (pathOr(false, ['message'], data)) {
      return Promise.resolve(data.message);
    } else if (is(String, data)) {
      return Promise.resolve(data);
    }
  }
  return Promise.reject(error);
}
