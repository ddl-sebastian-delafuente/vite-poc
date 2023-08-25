import { is } from 'ramda';

export const SELECT = 'select';
export const INPUT = 'input';
export const CHECKBOX = 'checkbox';

export type DebouncedFunction = (...args: any[]) => void;

export function debounceInput(F: DebouncedFunction, delay: number = 200) {
  let id: any = 0;

  return (...args: any[]) => {
    clearTimeout(id);

    id = setTimeout(
      function () {
        F.apply(null, args);
      },
      delay
    );
  };
}

export function forceReload(nextHref: string) {
  const origin = window.location.origin;
  const href = window.location.href;
  if (`${origin}${nextHref}` === href) {
    window.location.reload();
  } else {
    window.location.href = nextHref;
  }
}

export function getErrorMessage(error: any) {
  if (is(String, error)) {
    return error;
  }

  if (error.response && error.response.data) {
    return error.response.data;
  }
  if (error.responseText) {
    return error.responseText;
  }
  if (error.message) {
    return error.message;
  }
  if (error.status && error.statusText) {
    return `${error.status} - ${error.statusText}`;
  }
  return 'Something went wrong.';
}

export default {
  getErrorMessage,
  forceReload,
  debounceInput,
};
