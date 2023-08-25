import 'whatwg-fetch';
import { getErrorMessage } from '../errorUtil';

describe('getErrorMessage', () => {
  it('should get json string bodies from fetch object', async () => {
    const expected = 'string string';
    const body = new Response(`"${expected}"`);

    const actual = await getErrorMessage({ body });
    expect(actual).toEqual(expected);
  });

  it('should get json objects with a message key from fetch object', async () => {
    const expected = 'this is an error message';
    const body = new Response(JSON.stringify({ message: expected }));

    const actual = await getErrorMessage({ body });

    expect(actual).toEqual(expected);
  });

  it('should fail on json objects bodies with no message key', async () => {
    const body = new Response(JSON.stringify({ randomKey: 'message message' }));
    const errorResponse = { body };
    await expect(getErrorMessage(errorResponse)).rejects.toEqual(errorResponse);
  });

  it('should not fail on objects with no body and an object witha message key as a response', async () => {
    const error = {
      response: {
        data: {
          message: 'crazy failure',
        },
      },
    };
    await expect(getErrorMessage(error)).resolves.toEqual('crazy failure');
  });

  it('should not fail on error objects with no body and a response that is a string', async () => {
    const error = {
      response: {
        data: 'crazy failure',
      },
    };
    await expect(getErrorMessage(error)).resolves.toEqual('crazy failure');
  });
});
