import * as R from 'ramda';
import * as React from 'react';

export interface Pager {
  current: number;
  pageSize: number;
  total: number;
}

export interface UsePaginationProps {
  data: any[];
  initialPage?: number;
  pageSize?: number;
}

export interface UsePaginationReturn extends Pager {
  goToPage: (nextPage: number) => void;
  maxPage: number;
  range: [number, number],
  recordBegin: number;
  recordEnd: number;

  /**
   * Updates the current page size
   * note by doing this current page will be reset back to 1
   */
  updatePageSize: (newPageSize: number) => void;
}

export const usePagination = ({
  data,
  initialPage = 1,
  pageSize = 10,
}: UsePaginationProps): UsePaginationReturn => {
  const [pager, setPager] = React.useState<Pager>({
    current: data.length === 0 ? 0 : initialPage,
    pageSize,
    total: data.length,
  });

  const maxPage = React.useMemo(() => 
    Math.ceil(pager.total/pager.pageSize), 
  [pager.total, pager.pageSize]);

  const recordBegin = React.useMemo(() => {
    if (pager.current === 0) {
      return 0;
    }

    if (pager.current === 1)  {
      return 1;
    }

    return (pager.current - 1) * pager.pageSize + 1;
  }, [
    pager,
  ]);
  
  const recordEnd = React.useMemo(() => {
    const offset = R.cond([
      [R.equals(0), R.always(0)],
      [R.equals(1), R.always(0)],
      [R.equals(2), R.always(pager.pageSize)],
      [R.T, cur => (cur - 1) * pager.pageSize],
    ])(pager.current);

    if ((offset + pager.pageSize) > pager.total) {
      return pager.total;
    }

    return offset + pager.pageSize;
  }, [pager]);

  const goToPage = React.useCallback((nextPage: number) => {
    if (nextPage > maxPage) {
      throw new RangeError(`${nextPage} exceeds max pages (${maxPage})`)
    }

    if (nextPage < 1) {
      throw new RangeError(`${nextPage} is less than min page size of 1`)
    }

    setPager({
      ...pager,
      current: nextPage,
    });
  }, [
    maxPage,
    pager,
    setPager,
  ]);

  const updatePageSize = React.useCallback((newPageSize: number) => {
    if (!newPageSize || newPageSize < 1) {
      throw new RangeError(`Page size cannot be lower than 1`);
    }

    setPager({
      ...pager,
      current: 1,
      pageSize: newPageSize,
    });
  }, [
    pager,
    setPager,
  ]);

  React.useEffect(() => {
    if (data.length !== pager.total) {
      setPager({
        ...pager,
        current: data.length === 0 ? 0 : 1,
        total: data.length,
      });
    }

  }, [
    data,
    pager,
    setPager,
  ]);

  return {
    ...pager,
    goToPage,
    maxPage,
    range: [recordBegin, recordEnd],
    recordBegin,
    recordEnd,
    updatePageSize,
  };
}
