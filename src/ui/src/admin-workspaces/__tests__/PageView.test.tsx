import 'whatwg-fetch';
import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import { StorageUnit } from '@domino/api/dist/types';
import Page from '../src/PageView';
import { WorkspacePaginationTableRow, WorkspaceRowClusterInfo, WorkspaceTableState } from '../src/types';

const states = ['Starting', 'Started', 'Stopping', 'Stoped'];

function makeRow(
  ownerUsername: undefined | string = 'ownerusername',
  pvSpaceGiB: undefined | number = Math.round(Math.random() * 200),
  clusterInfo: undefined | WorkspaceRowClusterInfo = undefined
): WorkspacePaginationTableRow {
  return {
    workspaceId: `workspaceId-${Math.random()}`,
    name: `workspace name ${Math.random()}`,
    ownerUsername,
    environmentName: 'environmentName',
    pvSpaceGiB,
    pvSpace: {
      unit: 'GB' as StorageUnit,
      value: 22,
    },
    projectName: 'projectName',
    projectOwnerName: 'projectOwnerName',
    pvcName: 'workspace-pvId123',
    workspaceState: states[Math.floor(Math.random() * states.length)],
    workspaceCreatedTime: Math.round(Date.now() * Math.random()),
    clusterInfo,
    dataPlaneName: 'pew pew',
  };
}

const clusterRowInfo: WorkspaceRowClusterInfo = {
  clusterType: ComputeClusterLabels.Spark,
  minWorkers: 10
};

const defaultRows = [
  makeRow('This Is An Owner Name'),
  makeRow('workspace-pvId123', undefined, clusterRowInfo)
];

const defaultError = {
  name: 'error',
  body: new Response(),
  'headers': new Headers(),
  message: 'oh no',
  status: 502,
};

const defaultProps = {
  pageNumber: 1,
  pageSize: 0,
  totalEntries: 0,
  rows: [],
  handleStateChange: (state: WorkspaceTableState) => undefined,
  workspaceCountQuota: undefined,
  workspaceVolumeAllocationQuota: undefined,
  summaryLoading: false,
  workspacesLoading: false,
  workspacesFetchError: undefined,
  summaryFetchError: undefined,
};

describe('PageWithErrorHandling', () => {
  it('should show summary wait spinner when summary loading is true', () => {
    const view = render(<Page {...defaultProps} summaryLoading={true}/>);
    expect(view.getAllByDominoTestId('wait-spinner')).toHaveLength(1);
  });

  it('should not show summary wait spinner when summary loading is false', () => {
    const view = render(<Page {...defaultProps} summaryLoading={false}/>);

    expect(view.queryAllByDominoTestId('wait-spinner')).toHaveLength(0);
  });

  it('should show summary error message if summary fetching failed', () => {
    render(
      <Page
        {...defaultProps}
        summaryLoading={false}
        workspacesLoading={true}
        summaryFetchError={defaultError}
      />
    );

    expect(screen.getByText('Failed to get summary information')).toBeTruthy();
  });

  it('should show table loading if no error and loading', () => {
    const view = render(
      <Page
        {...defaultProps}
        summaryLoading={false}
        workspacesLoading={true}
      />
    );
    const tableSpinnerSelector = '.ant-spin-dot.ant-spin-dot-spin';
    expect(view.baseElement.querySelectorAll(tableSpinnerSelector)).toHaveLength(1);
  });

  it('should show table with error message if workspaces fetch failed', () => {
    const view = render(
      <Page
        {...defaultProps}
        summaryLoading={false}
        workspacesLoading={false}
        workspacesFetchError={defaultError}
      />
    );
    const workspaceTable = view.getByDominoTestId('WorkspaceTable');
    expect(workspaceTable.textContent).toContain('An error occurred while fetching workspaces');
  });

  it('should show table if data in table if loaded', () => {
    const view = render(
      <Page
        {...defaultProps}
        summaryLoading={false}
        workspacesLoading={false}
        pageNumber={1}
        pageSize={2}
        totalEntries={defaultRows.length}
        rows={defaultRows}
      />
    );

    const workspaceTable = view.getByDominoTestId('WorkspaceTable');
    expect(workspaceTable.textContent).toContain('This Is An Owner Name');
    expect(workspaceTable.textContent).toContain('workspace-pvId123');
  });

  it('should show both summary cards if summary data loaded', () => {
    const view = render(
      <Page
        {...defaultProps}
        summaryLoading={false}
        workspaceCountQuota={{
          runningCount: 0,
          usedCount: 2,
          maxCount: 2000,
        }}
        workspaceVolumeAllocationQuota={{
          usedGiB: 40,
          maxGiB: 90,
        }}
      />
    );
    expect(view.container.getElementsByClassName('ant-card')).toHaveLength(2);
  });

  it('should trigger the state change callback with the filter query when the filter input changes', async () => {
    const spy = jest.fn();
    const view = render(
      <Page
        {...defaultProps}
        handleStateChange={spy}
        pageNumber={1}
        pageSize={2}
        totalEntries={defaultRows.length}
        rows={defaultRows}
        workspaceCountQuota={{
          runningCount: 0,
          usedCount: 2,
          maxCount: 2000,
        }}
        workspaceVolumeAllocationQuota={{
          usedGiB: 40,
          maxGiB: 90,
        }}
      />
    );
    userEvent.type(view.getByRole('combobox'), 'filter query');
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    const lastCallArgs = spy.mock.calls[0];
    expect(lastCallArgs[0].filterQuery).toEqual('filter query');
  });

  it('should truncate pv size 5.055 to 5.06', () => {
    const view = render(
      <Page
        {...defaultProps}
        pageNumber={1}
        pageSize={1}
        totalEntries={1}
        rows={[makeRow('ownername', 5.055)]}
        summaryLoading={false}
        workspacesLoading={false}
      />
    );
    const foundSizes = view.getAllByDominoTestId('WorkspacePVSize').map(elt => elt.textContent).join();
    expect(foundSizes).toEqual('5.06');
  });

  it('should truncate pv size 5.054 to 5.05', () => {
    const view = render(
      <Page
        {...defaultProps}
        pageNumber={1}
        pageSize={1}
        totalEntries={1}
        rows={[makeRow('ownername', 5.054)]}
        summaryLoading={false}
        workspacesLoading={false}
      />
    );
    const foundSizes = view.getAllByDominoTestId('WorkspacePVSize').map(elt => elt.textContent).join();
    expect(foundSizes).toEqual('5.05');
  });

  it('should truncate pv size 0 to 0', () => {
    const view = render(
      <Page
        {...defaultProps}
        pageNumber={1}
        pageSize={1}
        totalEntries={1}
        rows={[makeRow('ownername', 0)]}
        summaryLoading={false}
        workspacesLoading={false}
      />
    );

    const foundSizes = view.getAllByDominoTestId('WorkspacePVSize').map(elt => elt.textContent).join();
    expect(foundSizes).toEqual('0');
  });

  it('should truncate pv size .10 to 0.1', () => {
    const view = render(
      <Page
        {...defaultProps}
        pageNumber={1}
        pageSize={1}
        totalEntries={1}
        rows={[makeRow('ownername', 0.10)]}
        summaryLoading={false}
        workspacesLoading={false}
      />
    );
    const foundSizes = view.getAllByDominoTestId('WorkspacePVSize').map(elt => elt.textContent).join();
    expect(foundSizes).toEqual('0.1');
  });

  it('show correct cluster info', () => {
    const view = render(
      <Page
        {...defaultProps}
        pageNumber={1}
        pageSize={2}
        totalEntries={defaultRows.length}
        rows={defaultRows}
        summaryLoading={false}
        workspacesLoading={false}
      />
    );
    const foundClusterInfo = view.getAllByDominoTestId('WorkspaceClusterInfo').map(elt => elt.textContent).join();
    expect(foundClusterInfo).toEqual('None,Spark (10 workers)');
  });

  it('should show the min and max workers correctly when exists', () => {
    const view = render(
      <Page
        {...defaultProps}
        pageNumber={1}
        pageSize={2}
        totalEntries={1}
        rows={[makeRow('workspace-pvId123', undefined, {...clusterRowInfo, minWorkers: 1, maxWorkers: 2 })]}
        summaryLoading={false}
        workspacesLoading={false}
      />
    );
    const foundClusterInfo = view.getAllByDominoTestId('WorkspaceClusterInfo').map(elt => elt.textContent).join();
    expect(foundClusterInfo).toEqual('Spark (1 - 2 workers)');
  });

  it('should not pluralize the cluster label for single worker clusters', () => {
    const view = render(
      <Page
        {...defaultProps}
        pageNumber={1}
        pageSize={2}
        totalEntries={1}
        rows={[makeRow('workspace-pvId123', undefined, {...clusterRowInfo, minWorkers: 1 })]}
        summaryLoading={false}
        workspacesLoading={false}
      />
    );
    const foundClusterInfo = view.getAllByDominoTestId('WorkspaceClusterInfo').map(elt => elt.textContent).join();
    expect(foundClusterInfo).toEqual('Spark (1 worker)');
  });
});
