import * as R from 'ramda';
import { HardwareTierRow } from './ComputeGridHardwareTierTable';

export const filterHardwareTierInfoRows = (record: HardwareTierRow, searchText: string): boolean => {
  const target = R.join('', R.values(R.pick(['name', 'nodePool', 'instanceType'], record)))
    .toLowerCase();
  return R.contains(searchText.toLowerCase(), target);
};
