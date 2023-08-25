import { kebabCase } from 'lodash';
import * as R from 'ramda';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import * as cronParser from 'cron-parser';
import { Information, StorageUnit } from '@domino/api/dist/types';

export const getTestId = (value: string, prefix?: string) => {
  if (!R.isNil(prefix) && !R.isEmpty(prefix)) {
    return `${prefix}-${value}`;
  }
  return value;
};

export const unitTypeToBytes = {
  'B': 1,
  'o': 1,
  'KB': 1000,
  'KiB': 1024,
  'MB': 1000 * 1000,
  'MiB': 1024 * 1024,
  'GB': 1000 * 1000 * 1000,
  'GiB': 1024 * 1024 * 1024,
  'TB': 1000 * 1000 * 1000 * 1000,
  'TiB': 1024 * 1024 * 1024 * 1024,
  'PB': 1000 * 1000 * 1000 * 1000 * 1000,
  'PiB': 1024 * 1024 * 1024 * 1024 * 1024,
  'EB': 1000 * 1000 * 1000 * 1000 * 1000 * 1000,
  'EiB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  'ZB': 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000,
  'ZiB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  'YB': 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000,
  'YiB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  'bit': .125,
  'Kbit': 125,
  'Kibit': 128,
  'Mbit': 125 * 1000,
  'Mibit': 128 * 1024,
  'Gbit': 125 * 1000 * 1000,
  'Gibit': 128 * 1024 * 1024,
  'Tbit': 125 * 1000 * 1000 * 1000,
  'Tibit': 128 * 1024 * 1024 * 1024,
  'Pbit': 125 * 1000 * 1000 * 1000 * 1000,
  'Pibit': 128 * 1024 * 1024 * 1024 * 1024,
  'Ebit': 125 * 1000 * 1000 * 1000 * 1000 * 1000,
  'Eibit': 128 * 1024 * 1024 * 1024 * 1024 * 1024,
  'Zbit': 125 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000,
  'Zibit': 128 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  'Ybit': 125 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000,
  'Yibit': 128 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
};

export const convertToUnitOrUndefined = (
  toUnit: StorageUnit,
  info?: Information,
  digits = 2
): number | undefined => {
  return info ? convertToUnit(toUnit, info, digits) : undefined;
};

export const convertToUnit = (toUnit: StorageUnit, info: Information, digits = 2): number => {
  const conversionRatio = unitTypeToBytes[info.unit] / unitTypeToBytes[toUnit];
  const newValue = roundTo(info.value * conversionRatio, digits);

  return newValue;
};

export const formatTimestamp = (timestamp: number, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(timestamp).format(format);
}

// https://stackoverflow.com/a/15762794/855201
export function roundTo(n: number, digits = 0): number {
  let negative = false;

  if (n < 0) {
    negative = true;
    n = n * -1;
  }

  const multiplicator = Math.pow(10, digits);

  n = parseFloat((n * multiplicator).toFixed(11));
  n = +(Math.round(n) / multiplicator).toFixed(digits);

  if (negative) {
    n = +(n * -1).toFixed(digits);
  }

  return n;
}

const uniqueIdGenerator = () => {
  let counter = 0;
  return function () {
    return ++counter;
  };
};

export const getUniqueId = uniqueIdGenerator();

export const determineBrowser: () => string = () => {
  // Returns string describing current browser
  const userAgent = navigator.userAgent;
  const match = userAgent.match(/(opera|chrome|safari|firefox|msie|edge|trident(?=\/))\/?\s*(\d+)/i) || [''];
  return match[0].split('/')[0];
};

export const getRepoName = (mainRepositoryUri?: string) => {
  if (mainRepositoryUri) {
    const repoUriArray = mainRepositoryUri.split('/');
    return `${repoUriArray[repoUriArray.length - 2]}/${repoUriArray[repoUriArray.length - 1]}`;
  }
  return null;
};

export const generateURL = (host: string, path?: string, port?: string) => {
  const url = new URL(host);
  if (path) {
    url.pathname = path;
  }
  if (port) {
    url.port = port;
  }
  return url.toString();
};

export const getCommand = (command: string, isSelected?: boolean) =>
  (!R.isNil(isSelected) && isSelected && !command.includes('"') && !command.includes(`'`) && command.includes(' '))
    ? `'${command}'` : command;

export const getLastNDaysEpochTime = (numberOfDays: number) => {
  return {
    endDate: moment()
      .utc()
      .endOf('day')
      .unix(),
    startDate: moment()
      .subtract(numberOfDays - 1, 'day')
      .utc()
      .startOf('day')
      .unix()
  };
};

export const getAllNDaysEpochTime = (numberOfDays: number) => {
  const countOfDays = [];

  for (let i = 0; i < numberOfDays; i++) {
    countOfDays.push({
      endDate: moment()
        .subtract(i, 'day')
        .utc()
        .endOf('day')
        .unix(),
      startDate: moment()
        .subtract(i, 'day')
        .utc()
        .startOf('day')
        .unix()
    })
  }

  return countOfDays
};

export const replaceNonAlphaNumerics = (text: string, replaceWith = '-') => {
  return text.replace(/[\W]+/g, replaceWith);
};

export const getCronNextSchedule = (cronString: string, timezone: string, format: string, toTimezone?: string) => {
  try {
    const interval = cronParser.parseExpression(cronString, {tz: timezone});
    const nextSchedule = +interval.next().toDate();

    if (R.isNil(toTimezone)) {
      return momentTimezone.tz(nextSchedule, timezone).format(format);
    }

    const nextScheduleMoment = momentTimezone.tz(nextSchedule, timezone);
    const nextScheduleDate = nextScheduleMoment.format('YYYY-MM-DD');

    const nextScheduleMomentInTargetTimezone = momentTimezone.tz(nextSchedule, toTimezone);
    const nextScheduleDateInTargetTimezone = nextScheduleMomentInTargetTimezone.format('YYYY-MM-DD');

    let otherDay = '';

    if (+moment(nextScheduleDate) > +moment(nextScheduleDateInTargetTimezone)) {
      otherDay = 'Previous day ';
    }

    if (+moment(nextScheduleDate) < +moment(nextScheduleDateInTargetTimezone)) {
      otherDay = 'Next day ';
    }
    return `${otherDay}${nextScheduleMomentInTargetTimezone.format(format)}`;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const makeTestId = (testId: string, prefix?: string) => {
  if (!prefix) {
    return kebabCase(testId);
  }

  return `${prefix}-${kebabCase(testId)}`;
}
