import * as React from 'react';
import moment from 'moment';
import { getDashboardEntries } from '@domino/api/dist/Admin';
import {
  DominoAdminInterfaceUserProjectEntry as UserProjectEntry
} from '@domino/api/dist/types';
import Link from '../../components/Link/Link';
import Table, { ColumnWidth, PAGE_SIZES, TableState } from '../../components/Table/Table';
import { error as errorToast } from '../../components/toastr';
import { jobsDashboardBase } from '../../core/routes';
import { numberComparer } from '../../utils/dataManipulation/utils';

// Type describing component State
export type State = {
  loading: boolean;
  error: boolean;
  userProjectEntries: UserProjectEntry[];
  totalEntries: number;
  pageNumber: number;
  pageSize: number;
  searchString?: string;
  sortBy?: string | number;
  sortOrder?: 'asc' | 'desc';
};

// Type describing component Props
export type Props = {
  offset: number | null;
  pageSize: number | null;
  checkpointProjectId?: string | null;
  totalEntries: number;
};

function formatDate(date: string, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(format);
}

const defaultColumns = [
  {
    key: 'name',
    title: 'Project Name',
    dataIndex: 'name',
    render: (name: string, row: UserProjectEntry) => (
        <Link openInNewTab={true} href={jobsDashboardBase(row.ownerUsername, row.name)}>{name}</Link>
    ),
    // do not specify width or it breaks column resizing
  },
  {
    key: 'ownerUsername',
    title: 'Owner Username',
    dataIndex: 'ownerUsername',
    sorter: false,
    render: (ownerUsername: string) => <span>{ownerUsername}</span>,
    width: 200
  },
  {
    key: 'ownerName',
    title: 'Owner Name',
    dataIndex: 'ownerName',
    sorter: false,
    render: (ownerName: string) => <span>{ownerName === undefined ? '' : ownerName}</span>,
    width: 200
  },
  {
    key: 'created',
    title: 'Created',
    dataIndex: 'created',
    sorter: numberComparer<UserProjectEntry>(userProjectEntry => moment(userProjectEntry.created).unix()),
    render: (created: string) => <span>{formatDate(created)}</span>,
    width: ColumnWidth.Timestamp
  },
  {
    key: 'runs',
    title: 'Execution Count',
    dataIndex: 'runs',
    align: 'right',
    sorter: false,
    render: (runs: number) => <span>{runs}</span>,
    width: ColumnWidth.Count
  },
  {
    key: 'lastRunStart',
    title: 'Last Active',
    dataIndex: 'lastRunStart',
    sorter: false,
    render: (lastRunStart?: string) => (
      <span>{lastRunStart === undefined ? '' : formatDate(lastRunStart)}</span>
    ),
    width: ColumnWidth.Timestamp
  },
  {
    key: 'totalRunTimeInHours',
    title: 'Total Execution Time (hr)',
    dataIndex: 'totalRunTimeInHours',
    align: 'right',
    sorter: false,
    render: (totalRunTimeInHours: number) => <span>{+totalRunTimeInHours.toFixed(2)}</span>,
    width: ColumnWidth.SecondaryText
  },
  {
    key: 'archived',
    title: 'Archived',
    dataIndex: 'archived',
    sorter: false,
    render: (archived: boolean) => <span>{archived ? 'True' : 'False'}</span>,
    width: ColumnWidth.Status
  }
];

const userProjectEntryKey = (record: UserProjectEntry) => record.projectId;

class ProjectsTable extends React.Component<Props, State> {
  state = {
    loading: true,
    error: false,
    userProjectEntries: [],
    totalEntries: 0,
    pageNumber: this.props.offset === null ? 0 : this.props.offset,
    pageSize: this.props.pageSize === null ? PAGE_SIZES[0] : this.props.pageSize,
    searchString: undefined,
    sortBy: undefined,
    sortOrder: undefined
  };

  async componentDidMount() {
    try {
      const { offset, pageSize, checkpointProjectId, totalEntries } = this.props;
      const result = await getDashboardEntries({
        offset: offset === null ? 0 : offset,
        pageSize: pageSize === null ? PAGE_SIZES[0] : pageSize,
        checkpointProjectId: checkpointProjectId === null ? undefined : checkpointProjectId
      });
      this.setState({
        userProjectEntries: result.page,
        loading: false,
        totalEntries
      });
    } catch (err) {
      errorToast(`Error fetching projects: ${err.status} ${err.name}`);
      this.setState({
        loading: false,
        error: true
      });
      console.warn(err);
    }
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {
    try {
      const { pageNumber, pageSize, searchString, sortBy, sortOrder } = this.state;
      const { totalEntries } = this.props;

      if (pageNumber !== prevState.pageNumber
        || pageSize !== prevState.pageSize
        || searchString !== prevState.searchString
        || sortBy !== prevState.sortBy
        || sortOrder !== prevState.sortOrder) {

        const result = await getDashboardEntries({
          offset: (pageNumber - 1) * pageSize,
          pageSize: pageSize,
          searchString,
          sortBy,
          sortOrder
        });

        this.setState({
          userProjectEntries: result.page,
          totalEntries: searchString === '' || searchString === undefined ? totalEntries : result.totalMatches
        });
      }
    } catch (err) {
      errorToast(`Error fetching projects: ${err.status} ${err.name}`);
      console.warn(err);
    }
  }

  onChange = (state: TableState<any>) => {
    this.setState({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchString: state.filterQuery === '' ? undefined : state.filterQuery,
      sortBy: state.sortKey === '' ? undefined : state.sortKey,
      sortOrder: state.sortDirection,
    });
  }

  render() {
    return (
      <Table
        // @ts-ignore
        columns={defaultColumns}
        dataSource={this.state.userProjectEntries}
        emptyMessage={this.state.error ?
          <>
            An error occurred while fetching projects. <Link href={window.location.href}>Refresh the page</Link>?
          </>
          : 'Projects on this deployment will appear here.'}
        rowKey={userProjectEntryKey}
        loading={this.state.loading}
        hideRowSelection={true}
        totalEntries={this.state.totalEntries}
        onChange={this.onChange}
        isControlled={true}
      // showSearch={false}
      />
    );
  }
}

export default ProjectsTable;
