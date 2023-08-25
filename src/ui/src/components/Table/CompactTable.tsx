import * as React from 'react';
import styled from 'styled-components';
import Table, { TableProps } from './Table';
import { colors, themeHelper } from '../../styled';

export const CompactTable = styled((props: TableProps<any>) => <Table {...props}/>)`
  .ant-table {
    font-size: ${themeHelper('fontSizes.tiny')};
  }
  .ant-table-content {
    border-radius: 0;
    padding-top: 0;
  }
  .ant-table-content table {
    border-radius: 0;
  }
  .ant-table-thead > tr:first-child > th:first-child {
    border-radius: 0;
  }
  .ant-table-thead > tr:first-child > th:last-child {
    border-radius: 0;
  }
  .ant-table-thead th {
    padding: 6px 12px;
    background-color: ${colors.athensGray};
  }
  .ant-table-tbody td {
    padding: 7px 12px;
  }
  .table-actions-wrapper {
    margin: 0;
  }
  .ant-pagination-total-text {
    display: none;
  }
  .ant-pagination.ant-table-pagination {
    margin-top: ${themeHelper('margins.small')};
  }
  th.col-sorted {
    font-weight: ${themeHelper('fontWeights.bold')};
  }
`;
