// eslint-disable-next-line no-restricted-imports
import { Pagination, PaginationProps } from 'antd';
import { debounce } from 'lodash';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import {
  CountSummary,
  formatSummary,
  PaginationFooterProps,
} from '../components/pagination/PaginationFooter';
import { 
  PAGE_SIZES,
  PageSizeDropdown, 
  PageSizeDropdownProps,
} from '../components/pagination/PageSizeDropdown';
import Input from '../components/TextInput/Input';
import { UsePaginationReturn } from '../components/pagination/usePagination';
import { UnionToMap } from '../utils/typescriptUtils';

type PickedFooterProps = 
  'summaryFormatter';

type PickedHookProps = 
  'current' |
  'maxPage' |
  'pageSize' |
  'range' |
  'total';

export type NativeControl = 
  'paginationPageControl' |
  'paginationPager' |
  'paginationRangeDisplay' |
  'search';
export const NativeControl: UnionToMap<NativeControl> = {
  paginationPageControl: 'paginationPageControl',
  paginationPager: 'paginationPager',
  paginationRangeDisplay: 'paginationRangeDisplay',
  search: 'search',
}

type ElementOrderOption<T> = T | JSX.Element | null;

export interface SearchableListProps<T = {}> extends 
  Pick<PaginationProps, 'simple'>,
  Pick<PageSizeDropdownProps, 'pageSizeOptions'>,
  Pick<PaginationFooterProps, PickedFooterProps>,
  Pick<UsePaginationReturn, PickedHookProps> {
  alwaysPaginate?: boolean;
  children: React.ReactElement<T>;
  footerControlOrder?: [
    ElementOrderOption<NativeControl>[],
    ElementOrderOption<NativeControl>[],
  ];
  headerControlOrder?: ElementOrderOption<NativeControl>[];
  NoSearchResultsComponent?: React.ComponentType;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  onSearch?: (query: string) => void;
  searchable?: boolean;
  searchTerm?: string;
  title?: string | JSX.Element;
}

const HeaderControlWrapper = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`;

const HeaderTitleWrapper = styled.div`
  align-items: center;
  display: flex;
`

const SearchableListFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SearchableListBody = styled.div``;
const SearchableListHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SearchableListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DefaultNoSearchResultsWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 200px;
  justify-content: center;
  width: 100%;
`;

const DefaultNoSearchResults = () => (
  <DefaultNoSearchResultsWrapper>There are no matching results.</DefaultNoSearchResultsWrapper>
);

export const SearchableList = ({
  alwaysPaginate,
  children,
  current,
  footerControlOrder = [
    [NativeControl.paginationRangeDisplay],
    [NativeControl.paginationPager],
  ],
  headerControlOrder = [NativeControl.paginationPageControl, NativeControl.search],
  maxPage,
  NoSearchResultsComponent = DefaultNoSearchResults,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageChange = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageSizeChange = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSearch = () => {},
  pageSizeOptions = PAGE_SIZES,
  pageSize,
  range,
  searchable,
  searchTerm,
  simple,
  summaryFormatter,
  title,
  total,
}: SearchableListProps) => {
  const formatter = React.useMemo(() => {
    return formatSummary(pageSize, current, total, summaryFormatter)
  }, [
    current, 
    pageSize, 
    summaryFormatter,
    total, 
  ]);

  const shouldShowNoResults = React.useMemo(() => {
    const [begin, end] = range;
    return searchTerm && !begin && !end;
  }, [range, searchTerm]);
  
  const canPaginate = React.useMemo(() => maxPage > 1 || alwaysPaginate, [alwaysPaginate, maxPage]);
  const shouldShowFooter = React.useMemo(() => {
    return canPaginate;
  }, [canPaginate]);

  const shouldShowHeader = React.useMemo(() => {
    return title || searchable || (canPaginate && searchable);
  }, [canPaginate, searchable, title]);

  const handlePageSizeChange = React.useCallback((newPageSize: number) => () => {
    onPageSizeChange(newPageSize);
  }, [onPageSizeChange]);

  const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  }, [onSearch])
  
  const debouncedHandleSearch = React.useMemo(() => {
    return debounce(handleSearch, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const pageSizeSelector = React.useMemo(() => (
    <PageSizeDropdown
      onPageSizeChange={handlePageSizeChange}
      pageSizeOptions={pageSizeOptions}
      pageSize={pageSize}
    />
  ), [
    handlePageSizeChange, 
    pageSizeOptions,
    pageSize,
  ]);

  const getControlElement = React.useCallback((control: ElementOrderOption<NativeControl>, index: number) => {
    if (typeof control === 'object') {
      return <span key={`custom-control-${index}`}>{control}</span>;
    }

    if (control === NativeControl.paginationPageControl && canPaginate) {
      return <span key={control}>{pageSizeSelector}</span>;
    }

    if (control === NativeControl.search && searchable) {
      return (
        <Input
          key={control}
          allowClear
          onChange={debouncedHandleSearch}
          placeholder="Search..."
          style={{ width: '250px' }}
        />
      );
    }

    if (control === NativeControl.paginationRangeDisplay) {
      return (
        <CountSummary key={control}>
          {formatter(total, range)}
        </CountSummary>
      );
    }

    if (control === NativeControl.paginationPager) {
      return (
        <Pagination
          key="pagination"
          current={current}
          onChange={onPageChange}
          pageSize={pageSize}
          showSizeChanger={false}
          simple={simple}
          total={total}
        />
      );
    }

    return null;
  }, [
    canPaginate,
    current,
    debouncedHandleSearch,
    formatter,
    onPageChange,
    pageSize,
    pageSizeSelector,
    range,
    searchable,
    simple,
    total,
  ]);

  const headerControls = React.useMemo(() => {
    return shouldShowHeader ? headerControlOrder.map(getControlElement) : null;
  }, [
    getControlElement,
    headerControlOrder,
    shouldShowHeader,
  ]);

  const footerControls = React.useMemo(() => {
    if (!shouldShowFooter) {
      return null;
    }

    const [leftControls, rightControls] = footerControlOrder;

    return (
      <>
        <div>{leftControls.map(getControlElement)}</div>
        <div>{rightControls.map(getControlElement)}</div>
      </>
    )
  }, [
    footerControlOrder,
    getControlElement,
    shouldShowFooter,
  ]);

  return (
    <SearchableListWrapper>
      {shouldShowHeader && (
        <SearchableListHeader>
          <HeaderTitleWrapper>{title}</HeaderTitleWrapper>
          <HeaderControlWrapper>{headerControls}</HeaderControlWrapper>
        </SearchableListHeader>
      )}
      <SearchableListBody>
        {R.cond([
          [() => shouldShowNoResults === true,  R.always(<NoSearchResultsComponent/>)],
          [R.T, R.always(children)],
        ])()}
      </SearchableListBody>
      {shouldShowFooter && (
        <SearchableListFooter>{footerControls}</SearchableListFooter>
      )}
    </SearchableListWrapper>
  )
}
