import * as React from 'react';
import Link from '../../components/Link/Link';
import Table from '../../components/Table/Table';
import columns from './tableColumns';
import { WorkspaceTableState, WorkspacePaginationTableRow } from './types';

const rowKey = (row: WorkspacePaginationTableRow) => row.workspaceId;

export type Props = {
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalEntries: number;
  rows: WorkspacePaginationTableRow[];
  error: boolean;
  onChange: (state: WorkspaceTableState) => void;
};

export const WorkspaceTable: React.FC<Props> = ({
  loading,
  rows,
  error,
  onChange,
  pageNumber,
  pageSize,
  totalEntries,
}) => {
    return (
      <Table
        data-test="WorkspaceTable"
        columns={columns()}
        dataSource={rows}
        emptyMessage={error ?
          <>
            An error occurred while fetching workspaces. <Link href={window.location.href}>Refresh the page</Link>?
          </>
          : 'Workspaces in this deployment will appear here.'}
        filterPlaceHolder="filter on title or state"
        rowKey={rowKey}
        loading={loading}
        hideRowSelection={true}
        isControlled={false}
        onChange={onChange}
        showPagination={true}
        showPageSizeSelector={true}
        showSearch={true}
        pageNumber={pageNumber}
        defaultPageSize={pageSize}
        totalEntries={totalEntries}
      />
    );
};

export default WorkspaceTable;
