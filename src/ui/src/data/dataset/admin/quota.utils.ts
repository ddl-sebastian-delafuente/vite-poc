import { BYTE_MULTPLIER } from '../../../utils/prettyBytes';

export const bytesToGigabytes = (value: number) => {
  return value/BYTE_MULTPLIER.GB;
}

export const gigabytesToBytes = (value: number) => {
  return value*BYTE_MULTPLIER.GB;
}
