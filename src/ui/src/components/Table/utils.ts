import * as R from 'ramda';
import { DataIndex } from 'rc-table/lib/interface';

// Get an object's attribute at a specified path
// e.g., getDataAtPath(['a', 'b'], { a: {b: 'x' } }, '') === 'x'
export const getDataAtPath = (dataIndex: DataIndex, obj: any, defaultValue: any): any => {
  let path = dataIndex;
  if (R.is(String, dataIndex) || R.is(Number, dataIndex)) {
    path = [dataIndex as string];
  }

  return R.pathOr(defaultValue, path as string[], obj);
};

// Returns a sorter function for string data type
export const stringSorter = (dataIndex: DataIndex) => (a: any, b: any) => {
  const strA: string = getDataAtPath(dataIndex, a, '');
  const strB: string = getDataAtPath(dataIndex, b, '');

  return R.is(String, strA) && R.is(String, strB) ? strA.localeCompare(strB) : 0;
};

// Returns a sorter function for numeric data type
export const numberSorter = (dataIndex: DataIndex, reverse?: boolean) => (a: any, b: any) => {
  const numA = getDataAtPath(dataIndex, a, 0);
  const numB = getDataAtPath(dataIndex, b, 0);

  return reverse ? numB - numA : numA - numB;
};

// returns a generic sorter that accesses specific keys
export const customKeyColumnSorter = (a: Record<string, unknown>, b: Record<string, unknown>, key: string[]): any => {
  return getDataAtPath(key, a, 0) - getDataAtPath(key, b, 0);
};
