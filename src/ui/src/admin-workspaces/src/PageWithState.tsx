import { convertToUnit, convertToUnitOrUndefined } from '@domino/ui/dist/utils/common';
import * as React from 'react';
import { ErrorObject } from '@domino/api/dist/httpRequest';
import { DominoWorkspaceApiWorkspaceSortableColumnsValue as SortKey } from '@domino/api/dist/types';
import { getWorkspaceAdminSummary, getAdminDashboardRowData }  from '@domino/api/dist/Workspace';
import { error as errorToast } from '../../components/toastr';
import PageView from './PageView';
import {
    WorkspaceCountQuota,
    WorkspaceDiscSpaceQuota,
    WorkspaceTableState,
    WorkspaceRow,
    WorkspacePaginationTableRow,
} from './types';

const DEFAULT_SORT_DIRECTION = 'asc';
const DEFAULT_FETCH_FAILURE_MESSAGE = 'Something went wrong while fetching data for this page';
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 50;
const handleShowErrorToast = async (error: ErrorObject) => {
    let text: undefined | string = undefined;
    try {
        text = await error.body.text();
        if (text !== undefined) {
            const json = JSON.parse(text);
            errorToast(json.message);
        } else {
            throw new Error('Could not parse the body out of the error response');
        }
    } catch (parseError) {
        console.error('Failed to parse error body', parseError);
        if (text) {
            errorToast(text);
        } else {
            errorToast(DEFAULT_FETCH_FAILURE_MESSAGE);
        }
    }
};
const getSortByQueryValue = (sortKey?: string | number): SortKey | undefined => {
    switch (sortKey) {
        case 'volumesize':
            return 'volumeSize';
        case 'laststart':
            return 'lastStartTime';
        case 'createdon':
            return 'createdTime';
        default:
            return;
    }
};

export type PaginationState = {
    pageNumber: number;
    pageSize: number;
    totalEntries: number;
    rows: WorkspacePaginationTableRow[];
};

export type SummaryState = {
    workspacesCountQuota?: WorkspaceCountQuota;
    workspaceVolumeAllocationQuota?: WorkspaceDiscSpaceQuota;
};

export type StateUpdate = {
    paginationState?: PaginationState;
    summaryState?: SummaryState;
    summaryLoading: boolean;
    workspacesLoading: boolean;
    workspacesFetchError?: ErrorObject;
    summaryFetchError?: ErrorObject;
};

function handleTableStateChangeHook(
        pageSize: number,
        pageNumber: number,
        sortDirection: 'asc' | 'desc',
        sortKey?: string | number,
        filterQuery?: string,
    ): StateUpdate {
    const [paginationState, setPaginationState] = React.useState<PaginationState | undefined>();
    const [summaryState, setSummaryState] = React.useState<SummaryState | undefined>();
    const [summaryFetchError, setSummaryFetchError] = React.useState<ErrorObject | undefined>();
    const [workspacesFetchError, setWorkspacesFetchError] = React.useState<ErrorObject | undefined>();
    const [summaryLoading, setSummaryLoading] = React.useState<boolean>(true);
    const [workspacesLoading, setWorkspacesLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        (async() => {
            try {
                const response = await getWorkspaceAdminSummary({});
                setSummaryState({
                    workspacesCountQuota: {
                        runningCount: response.totalStartedWorkspaces,
                        usedCount: response.totalNumWorkspaces,
                        maxCount: response.maxAllowedNumWorkspaces,
                    },
                    workspaceVolumeAllocationQuota: {
                        usedGiB: convertToUnit('GiB', response.totalAllocatedVolumeSize),
                        maxGiB: convertToUnitOrUndefined('GiB', response.maxAllowedAllocatedVolumeSize),
                    },
                });
            } catch (error) {
                console.error(error);
                handleShowErrorToast(error);
                setSummaryFetchError(error);
            } finally {
                setSummaryLoading(false);
            }
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            setWorkspacesLoading(true);
            setWorkspacesFetchError(undefined);
            try {
                const sortBy = getSortByQueryValue(sortKey);
                const response = await getAdminDashboardRowData({
                    offset: (pageNumber - 1) * pageSize,
                    limit: pageSize,
                    searchString: filterQuery,
                    sortBy,
                    sortOrder: sortDirection,
                });

                const updatedPageNumber = Math.floor(response.offset / response.limit);
                setPaginationState({
                    pageNumber: updatedPageNumber + 1,
                    pageSize: response.limit,
                    totalEntries: response.totalEntries,
                    // @ts-ignore
                    rows: response.tableRows.map((row: WorkspaceRow) => {
                      return ({
                        ...row,
                        diskUsagePercent: row.diskUsage && row.diskUsage.diskUsagePercent,
                        diskUsageGiB: row.diskUsage && row.diskUsage.diskUsageGiB,
                        maxDiskUsageGiB: row.diskUsage && row.diskUsage.maxDiskUsageGiB,
                        pvSpaceGiB: convertToUnit('GiB', row.pvSpace),
                        workspaceCreatedTime: new Date(row.workspaceCreatedTime).getTime(),
                        lastSessionStart: row.lastSessionStart ? new Date(row.lastSessionStart).getTime() : undefined,
                      })
                    }),
                });
            } catch (error) {
                console.error(error);
                handleShowErrorToast(error);
                setWorkspacesFetchError(error);
            } finally {
                setWorkspacesLoading(false);
            }
        })();
    }, [sortDirection, sortKey, filterQuery, pageSize, pageNumber]);

    return {
        paginationState,
        summaryState,
        summaryLoading,
        workspacesLoading,
        workspacesFetchError,
        summaryFetchError,
    };
}

export const PageWithState: React.FC = ()  => {
    const [tableState, setTableState] = React.useState<WorkspaceTableState>({
        sortDirection: DEFAULT_SORT_DIRECTION,
        sortKey: undefined,
        filterQuery: '',
        pageSize: DEFAULT_PAGE_SIZE,
        pageNumber: DEFAULT_PAGE_NUMBER,
        columnFilters: [],
        filteredData: [],
        filteredColumns: [],
    });

    const {
        paginationState,
        summaryState,
        summaryLoading,
        workspacesLoading,
        workspacesFetchError,
        summaryFetchError,
    } = handleTableStateChangeHook(
        tableState.pageSize,
        tableState.pageNumber,
        tableState.sortDirection || DEFAULT_SORT_DIRECTION,
        tableState.sortKey,
        tableState.filterQuery,
    );

    const {
        workspacesCountQuota,
        workspaceVolumeAllocationQuota,
    } = summaryState || {
        workspacesCountQuota: undefined,
        workspaceVolumeAllocationQuota: undefined,
    };
    const {
        pageNumber = DEFAULT_PAGE_NUMBER,
        pageSize = DEFAULT_PAGE_SIZE,
        totalEntries = 0,
        rows = []
    } = paginationState || {};
    return (
        <PageView
            summaryLoading={summaryLoading}
            workspacesLoading={workspacesLoading}
            workspacesFetchError={workspacesFetchError}
            summaryFetchError={summaryFetchError}
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalEntries={totalEntries}
            rows={rows}
            workspaceCountQuota={workspacesCountQuota}
            workspaceVolumeAllocationQuota={workspaceVolumeAllocationQuota}
            handleStateChange={setTableState}
        />
    );

};

export default PageWithState;
