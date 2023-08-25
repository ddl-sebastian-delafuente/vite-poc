import * as React from 'react';

import { usePagination } from '../../components/pagination/usePagination';
import { getDevStoryPath } from '../../utils/storybookUtil';
import { 
  NativeControl,
  SearchableList as SearchableListComponent, 
  SearchableListProps,
} from '../SearchableList';

export default {
  title: getDevStoryPath('Develop/Data'),
  component: SearchableListComponent,
  argTypes: {
    current: { control: false },
    maxPage: { control: false },
    range: { control: false },
    summaryFormatter: { control: false },
    total: { control: false },
  },
  args: {
    alwaysPaginate: false,
    dataSize: 50,
    initialPage: 1,
    pageSize: 10,
    searchable: true,
    simple: true,
  }
};

interface TemplateProps extends SearchableListProps {
  dataSize: number;
  initialPage: number;
}

const Template = ({
  dataSize,
  initialPage,
  pageSize,
  ...args
}: TemplateProps) => {
  const data = React.useMemo(() => {
    return new Array(dataSize).fill('').map((value, index) => `Record ${index + 1}`);
  }, [dataSize]);

  const pager = usePagination({
    data,
    initialPage,
    pageSize,
  });

  const pagedData = React.useMemo(() => {
    const [begin, end] = pager.range;
    return data.slice(begin - 1, end);
  }, [data, pager.range]);

  return (
    <SearchableListComponent
      {...args}
      current={pager.current}
      maxPage={pager.maxPage}
      pageSize={pager.pageSize}
      onPageChange={pager.goToPage}
      onPageSizeChange={pager.updatePageSize}
      range={pager.range}
      total={pager.total}
    >
      <div>
        {pagedData.map(record => (<div key={record}>{record}</div>))}
      </div>
    </SearchableListComponent>
  )
}

export const SearchableList = Template.bind({});

export const SearchableListWithCustomHeaderControl = Template.bind({});
SearchableListWithCustomHeaderControl.args = {
  headerControlOrder: [
    NativeControl.search,
    NativeControl.paginationPageControl,
    <button key="button">Some other button</button>
  ]
}
