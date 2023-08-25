import * as R from 'ramda';
import pluralize from 'pluralize';
import moment from 'moment';
import { ErrorObject } from '@domino/api/dist/httpRequest';
import { urlSearchStringToObject } from '../../utils/searchUtils';

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong';

export const getFromQuery = (query: string) => {
  const locationObj = urlSearchStringToObject(location.search);
  return R.prop(query, locationObj);
};

export const upsertElementByKeyInList = (key: string, element: any, list: any[]): any[] => {
  const index = R.findIndex(R.propEq(key, element[key]), list);
  if (index !== -1) {
    list[index] = element;
    return list;
  }
  return R.prepend(element, list);
};

export const timeFormat = 'MMM Do, YYYY @ hh:mm:ss A';

export const shortTimeFormat = 'MMMM Do YYYY @ HH:mm';

export const longDateFormat = 'YYYY-MM-DD hh:mm:ss';

export const shortTimeWithoutAt = 'MMMM Do hh:mm a';

export const shortTimeFormatWithYearAndMeridian = 'MM/DD/YY hh:mm A';

export const shortTime = 'MMM D';

export const formatStartTime = (startTime?: number) => moment(startTime).format(timeFormat);

export const formatCommentDate = (timestamp: number) => moment(timestamp).format(shortTimeFormat);

export const formatLongDate = (timestamp: number) => moment(timestamp).format(longDateFormat);

export const formatShortTimeWithoutAt = (timestamp?: number) => moment(timestamp).format(shortTimeWithoutAt);

export const computeDuration = (a: number, b: number) => moment(a).diff(b);

export const formatShortTime = () => moment().format(shortTime);

export const getDuration = (startTime?: number, endTime?: number) => {
  if (startTime && endTime) {
    const end = moment(endTime);
    const start = moment(startTime);
    const diff = end.diff(start);
    const diffDuration = moment.duration(diff);
    const days = diffDuration.days();
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();
    return diff < 0 ? '--' : (days > 0 ? `${days} ${pluralize('day', days)} : ${hours} ${pluralize('hr', hours)}` :
      `${hours} ${pluralize('hr', hours)} : ${minutes} ${pluralize('min', minutes)}`);
  }
  return '--';
};

export const getErrorMessage = async (
  e: ErrorObject,
  defaultMessage = DEFAULT_ERROR_MESSAGE
): Promise<string> => {
  try {
    if (!e.body || typeof e.body.json !== 'function') {
      return defaultMessage;
    }
    try {
      const body = await e.body.json();
      return body.message || defaultMessage;
    } catch (e)  {
      return defaultMessage;
    }
  } catch (newError: any) {
    console.error(newError);
    return defaultMessage;
  }
};

// NOTE: duplication with getErrorMessage because once ErrorObject stream is read, it cannot be re-read
export const getErrorCodeWithMessage = async (
  e: ErrorObject,
  defaultErrorCode: number,
  defaultMessage = DEFAULT_ERROR_MESSAGE,
): Promise<{code: number, message: string}> => {
  try {
    if (!e.body || typeof e.body.json !== 'function') {
      return { code: defaultErrorCode, message: defaultMessage };
    }
    try {
      const body = await e.body.json();
      const message = body.message || defaultMessage;
      const code = body.error.code || defaultErrorCode;
      return {
        code,
        message,
      }
    } catch (e)  {
      return {
        code: defaultErrorCode,
        message: defaultMessage
      };
    }
  } catch (newError: any) {
    return {
      code: defaultErrorCode,
      message: defaultMessage
    };
  }
}

export const formatCPU = (cpu: number) => Number(cpu.toFixed(2));

export const formatMemory = (memory: number) => Number(R.divide(memory, 1000000).toFixed(2));

export const chooseFirstIfOnlyone = (list: any[]): any => {
  if (R.length(list) === 1) {
    return R.nth(0, list);
  }
  return;
};

export const mbToBytes = (memory: number) =>  Number(R.multiply(memory, 1000000));

// 1 GiB = 1024 MiB = 1024 * 1024 KiB = 1024 * 1024 * 1024 B
export const bytesToGiB = (memory: number, withoutFormatting?: boolean) => withoutFormatting ?
  R.divide(memory, 1073741824) : Number(R.divide(memory, 1073741824).toFixed(2));
