import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Pagination } from 'antd';
import styled from 'styled-components';
import PaginatorStyle from './PaginatorStyle';
import 'antd/dist/antd.css';
import FlexLayout from '../Layouts/FlexLayout';
import { themeHelper } from '../../styled/themeUtils';

export type AntDSummaryFormatter = (total: number, range: [number, number]) => JSX.Element;

export type SummaryFormatter = (pageSize: number, pageNumber: number, totalEntries: number) => AntDSummaryFormatter;

export interface PaginationFooterProps {
  onChange: (pageNumber: number) => void;
  pageNumber: number;
  pageSelector?: React.ReactNode;
  pageSize: number;
  range?: [number, number];
  simple: boolean;
  summaryFormatter?: SummaryFormatter;
  totalEntries: number;
}

const StyledPaginator = styled.div`
  .ant-pagination {
    ${PaginatorStyle}
  }
  .ant-pagination .anticon {
    vertical-align: -0.15em;
  }

`;

export const CountSummary = styled.span`
  margin-right: ${themeHelper('margins.large')};
`;

export const formatSummary = (
    pageSize: number,
    pageNumber: number,
    totalEntries: number,
    customFormatter?: SummaryFormatter
): AntDSummaryFormatter => {

  if (customFormatter) {
    return customFormatter(pageSize, pageNumber, totalEntries);
  }

  return (total: number, range: [number, number]) => (
    <span>
      Showing {range[0]}–{range[1]} out of {total}
    </span>
  );
}

/**
 * A totally controlled page selection component and summary displaying component
 */
export default function PaginationFooter({
    totalEntries,
    pageSize,
    pageNumber,
    onChange,
    summaryFormatter,
    simple,
    pageSelector,
    ...props
  }: PaginationFooterProps) {

  const range = React.useMemo((): [number, number] => {
    if (props.range) {
      return props.range;
    }

    const start = totalEntries ? (pageNumber - 1) * pageSize + 1 : 0;
    const end = Math.min(start + pageSize, totalEntries);
    return [start, end];
  }, [
    pageNumber,
    pageSize,
    props.range,
    totalEntries,
  ]);

  return (
    <StyledPaginator>
      <FlexLayout justifyContent="space-between" itemSpacing={0}>
        {pageSelector && <FlexLayout itemSpacing={0}>
          <CountSummary>
            {formatSummary(pageSize, pageNumber, totalEntries, summaryFormatter)(
              totalEntries, range)}
          </CountSummary>
          {pageSelector}
        </FlexLayout>}
        <Pagination
          simple={simple}
          onChange={onChange}
          total={totalEntries}
          pageSize={pageSize}
          current={pageNumber}
          showSizeChanger={false}
        />
      </FlexLayout>
    </StyledPaginator>
  );
}
