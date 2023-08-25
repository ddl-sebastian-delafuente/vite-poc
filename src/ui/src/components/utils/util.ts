import { NETWORK_ERROR_600 } from '@domino/api/dist/httpRequest';
import * as R from 'ramda';
import { error as toastrError } from '../toastr';

export const getLoginUrl = (customRedirectUrl?: string) => {
  const redirectPath = encodeURIComponent(customRedirectUrl || window.location.href);
  return `/secured?redirectPath=${redirectPath}`;
};

export const getWithDefault = (obj: any, defaultVal: any, targetField: string) => {
  const ramdaFn = R.ifElse(
    R.isNil,
    () => defaultVal,
    R.ifElse(
      R.compose(R.isNil, R.prop(targetField)),
      () => defaultVal,
      R.prop(targetField)
    )
  );

  return ramdaFn(obj);
};

// Ramda `toString` wraps TypeScript enums with escaped quotes, so use vanilla JS string conversion
export const caseInsensitiveEquals = R.curry(
  (a, b) => R.toLower(String(a)) === R.toLower(String(b))
);

export const caseInsensitiveContains = R.curry(
  (a, b: any[]) => R.contains(R.toLower(String(a)), R.map(R.toLower, b))
);

export const pause = (durationInMs: number) => new Promise(res => setTimeout(res, durationInMs));

export function handleExecutionWithToast<T>(apiCall: Promise<T>, defaultValue: T, failureMessage: string): Promise<T> {
  return apiCall.catch((error: any) => {
    console.warn(`${failureMessage}. error: ${error}`);
    if (error.status !== NETWORK_ERROR_600) {
      toastrError(failureMessage);
    }
    return Promise.resolve(defaultValue);
  });
}
