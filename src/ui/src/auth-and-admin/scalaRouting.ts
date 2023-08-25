import { get } from 'lodash';

export type Route = {
  getRoute: (routeName: string) => (...args: any[]) => {
    url: string;
    method: string;
    fetch: (options?: any) => Promise<any>;
  };
};

/**
 * Gets a reference to a router created by Play's JavaScript routing helper.
 *
 * In Scala:
 *
 * ```scala.html
 * @helper.javascriptRouter("MyRoutes")(
 *   path.to.routes.javascript.MyController.myRoute
 * )
 * ```
 *
 * Getting a route (note the missing `routes.javascript`):
 *
 * ```js
 * const myRoute = getRouter('MyRoutes').getRoute('path.to.MyController.myRoute')
 * ```
 *
 * Please note: if the router or route does not exist, this will not throw
 * an error until the route is used.
 *
 * Using URLs:
 *
 * ```js
 * window.location.href = myRoute().url
 * window.location.href = myRouteWithArguments('foo', 'bar').url
 * ```
 *
 * Interacting with an HTTP endpoint:
 *
 * ```js
 * await myRoute().fetch({ body: JSON.stringify({ ... }) })
 * ```
 *
 * This will use the correct HTTP method, send appropriate headers, and
 * interpret 4xx and 5xx responses as errors.
 *
 * More information: https://www.playframework.com/documentation/2.6.x/ScalaJavascriptRouting
 */
export function getRouter(routerName: string): Route {
  return {
    getRoute(routeName: string) {
      return function getRouteWithArgs(...args: any[]) {
        // eslint-disable-next-line
        const router = global[routerName];
        if (typeof router !== 'object') {
          console.warn(
            `Router \`window.${routerName}\` not found. ` +
            `Use \`@helpers.javascriptRouter("${routerName}")( ...routes... )\` ` +
            `in Scala to create a router.`,
          );
        }
        const route =
          router.getRoute ?
            router.getRoute(routeName) :
            get(router, routeName);
        if (typeof route !== 'function') {
          throw new Error(
            `Router '${routerName}' does not contain '${routeName}.'`,
          );
        }
        const extendedRoute = extendRoute(route);
        const resolvedRoute = extendedRoute(...args);
        return resolvedRoute;
      };
    },
  };
}

/**
 * Extends the route created by Play with a fetch method.
 */
export function extendRoute(route: any) {
  return (...args: any[]) => {
    const { url, method, ...rest } = route(...args);
    return {
      url,
      method,
      fetch(options: any) {
        return fetchFromDomino(url, { method, ...options });
      },
      ...rest
    };
  };
}

export const invalidJSONErrorMessage = 'The server responded with invalid JSON';
export const invalidJSONOnErrorResponseErrorMessage = (response: { status: number }) =>
  `The server responded with a ${response.status} error but did not return valid JSON`;
export const errorResponseWithoutMessageErrorMessage = (response: { status: number }) =>
  `The server responded with a ${response.status} error but did not provide an error message`;

/**
 * Fetches a domino URL. This sends appropriate headers, and interprets 4xx and
 * 5xx responses as errors.
 */
export async function fetchFromDomino(url: string, options: any) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  });
  let responseBody;
  try {
    responseBody = await response.json();
  } catch (responseBodyParseError) {
    const error = new Error(
      response.ok
        ? invalidJSONErrorMessage
        : invalidJSONOnErrorResponseErrorMessage(response),
    );
    // @ts-ignore
    error.response = response;
    // @ts-ignore
    error.responseBodyParseError = responseBodyParseError;
    throw error;
  }
  if (!response.ok) {
    const errorMessage = responseBody.message;
    const error = new Error(
      errorMessage || errorResponseWithoutMessageErrorMessage(response),
    );
    // @ts-ignore
    error.response = response;
    // @ts-ignore
    error.responseBody = responseBody;
    throw error;
  }
  return responseBody;
}

/**
 * Creates a promise that never resolves, which is the default behavior for
 * fetching on mock routes.
 */
export function createNonResolvingPromise() {
  return new Promise(() => undefined);
}
