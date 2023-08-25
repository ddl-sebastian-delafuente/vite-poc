import * as React from 'react';

import { getStandardStoryPath } from '../../../utils/storybookUtil';
import { usePagination, UsePaginationProps } from '../usePagination';

interface TemplateProps extends Pick<UsePaginationProps, 'initialPage' | 'pageSize'> {
  dataSize: number,
}

const Template = ({
  dataSize,
  initialPage,
  pageSize
}: TemplateProps) => {
  const data = React.useMemo(() => {
    return new Array(typeof dataSize === 'number' ? dataSize : 10).fill('');
  }, [dataSize]);

  const pager = usePagination({
    data,
    initialPage,
    pageSize,
  });

  const goToPage = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    pager.goToPage(value);
  }, [pager])

  const prevPage = React.useCallback(() => {
    pager.goToPage(pager.current - 1);
  }, [pager]);

  const nextPage = React.useCallback(() => {
    pager.goToPage(pager.current + 1);
  }, [pager]);

  const updatePageSize = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    pager.updatePageSize(value);
  }, [pager])

  return (
    <div>
      <div>total elements: {pager.total}</div>
      <div>current page: {pager.current}</div>
      <div>page size: {pager.pageSize}</div>
      <div>max page: {pager.maxPage}</div>
      <div>record begin: {pager.recordBegin}</div>
      <div>record end: {pager.recordEnd}</div>
      <div>
        <button onClick={prevPage}>Prev</button>
        <input onChange={goToPage} type="text" value={pager.current} />
        <button onClick={nextPage}>Next</button>
        <input onChange={updatePageSize} type="text" value={pager.pageSize} />
      </div>
    </div>
  )
}

export default {
  title: getStandardStoryPath('Content Containers/Pagination'),
  component: Template,
  args: {
    dataSize: 50,
  }
}

export const UsePaginationHook = Template.bind({});
