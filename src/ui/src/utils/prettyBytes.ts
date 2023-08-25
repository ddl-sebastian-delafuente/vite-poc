import { StorageUnitBytes } from '../proxied-api/types';

const UNITS = [
  StorageUnitBytes.B,
  StorageUnitBytes.KB,
  StorageUnitBytes.MB,
  StorageUnitBytes.GB,
  StorageUnitBytes.TB,
  StorageUnitBytes.PB,
  StorageUnitBytes.EB,
  StorageUnitBytes.ZB,
  StorageUnitBytes.YB,
];

export const BYTE_MULTPLIER: { [key: string]: number } = UNITS.reduce((memo, unit, index) => {
  memo[unit] = index > 1 ? Math.pow(1000, index) : 1;
  return memo;
}, {});

// https://github.com/Flet/prettier-bytes/
export function prettyBytes(num: number) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num);
  }

  const neg = num < 0;

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B';
  }

  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), UNITS.length - 1);
  num = Number(num / Math.pow(1000, exponent));
  const unit = UNITS[exponent];

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit;
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit;
  }
}

const ByteFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

export const normalizeBytes = (num?: number): { unit: StorageUnitBytes, value: string } => {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num);
  }

  if (num === 0) {
    return {
      unit: StorageUnitBytes.B,
      value: '0'
    }
  }
  
  const numAbs = Math.abs(num);
  const exponent = Math.min(Math.floor(Math.log(numAbs) / Math.log(1000)), UNITS.length - 1);
  const unit = UNITS[exponent] || UNITS[0];
  const numNormalize = Number(num / Math.pow(1000, exponent));

  return {
    unit,
    value: !isNaN(numNormalize) ? ByteFormat.format(numNormalize) : '0',
  }
}
