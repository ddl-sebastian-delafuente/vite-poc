import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import {
    DominoWorkspaceApiWorkspaceAdminPageTableRow as Row,
    DominoDataplaneDataPlaneName
} from '@domino/api/dist/types';
import * as Workspace from '@domino/api/dist/Workspace';
import PageWithState from '../src/PageWithState';

let getAdminDashboardRowData: jest.SpyInstance;
let getWorkspaceAdminSummary: jest.SpyInstance;
let mocks: jest.SpyInstance[];

beforeAll(() => {
  getWorkspaceAdminSummary = jest.spyOn(Workspace, 'getWorkspaceAdminSummary').mockResolvedValue({
    totalNumWorkspaces: 206,
    maxAllowedNumWorkspaces: 500,
    totalAllocatedVolumeSize: {
      value: 30,
      unit: 'GiB'
    },
    maxAllowedAllocatedVolumeSize: {
      value: 540,
      unit: 'GiB'
    },
    totalStartedWorkspaces: 29,
  });
  getAdminDashboardRowData = jest.spyOn(Workspace, 'getAdminDashboardRowData');

  mocks = [
    getAdminDashboardRowData,
    getWorkspaceAdminSummary,
  ];
})

afterAll(() => {
  mocks.forEach((mock) => mock.mockRestore());
});

const createWorkspace = (name: string, state: Row['workspaceState'] = 'Started'): Row => ({
    workspaceId: Math.random().toString(),
    name,
    ownerUsername: 'integration-test',
    workspaceCreatedTime: new Date().toISOString(),
    lastSessionStart: new Date().toISOString(),
    environmentRevisionId: 'environmentRevisionId',
    environmentRevisionNumber: 1,
    environmentName: 'environmentName',
    pvSpace: { value: 5, unit: 'GiB' },
    projectName: 'quick-start',
    projectOwnerName: 'integration-test',
    workspaceState: state,
    pvcName: 'catdog',
    dataPlaneName: 'pew pew' as unknown as DominoDataplaneDataPlaneName,
});

describe('PageWithState', () => {
    const baseNames = Array(50).fill(null).map((x, i) => i);
    const page1 = baseNames.map(n => createWorkspace(n.toString()));
    const page2 = baseNames.map(n => n + 50).map(n => createWorkspace(n.toString()));

  it('should request data at offset 0 on page load', () => {
    getAdminDashboardRowData.mockResolvedValue({
      offset: 0,
      limit: 0,
      totalEntries: 0,
      tableRows: [],
    })

    render(<PageWithState />);
    expect(getAdminDashboardRowData).toHaveBeenCalledWith(expect.objectContaining({
      offset: 0
    }))
  });

  it('should request data at offset 50 when second page clicked', async () => {
    getAdminDashboardRowData.mockImplementation(async ({ offset, limit }) =>  ({
        offset,
        limit,
        totalEntries: 100,
        tableRows: [page1, page2][Math.floor(offset / limit)],
    }))

    const view = render(<PageWithState />);
    await waitFor(() => expect(view.baseElement.querySelector('.ant-pagination-item-2')).toBeTruthy());
    await userEvent.click(view.baseElement.querySelector('.ant-pagination-item-2') as HTMLElement);
    await waitFor(() => expect(getAdminDashboardRowData).toHaveBeenLastCalledWith(expect.objectContaining({ offset: 50 })));
  });

  it('should have correct pagination button selected after second page clicked', async () => {
    getAdminDashboardRowData.mockImplementation(async ({ offset, limit }) =>  ({
        offset,
        limit,
        totalEntries: 100,
        tableRows: [page1, page2][Math.floor(offset / limit)],
    }));

    const view = render(<PageWithState />);
    await waitFor(() => expect(view.baseElement.querySelectorAll('.ant-pagination-item-1.ant-pagination-item-active')).toBeTruthy());
    await waitFor(() => expect(view.baseElement.querySelectorAll('.ant-pagination-item-1.ant-pagination-item-active')).toHaveLength(1));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-pagination-item-2')).toBeTruthy());
    await userEvent.click(view.baseElement.querySelector('.ant-pagination-item-2') as HTMLElement);
    await waitFor(() => expect(view.baseElement.querySelectorAll('.ant-pagination-item-2.ant-pagination-item-active')).toHaveLength(1));
  });

  it('should show the correct 50 rows from the second page after second page clicked', async () => {
    getAdminDashboardRowData.mockImplementation(async ({ offset, limit }) =>  ({
      offset,
      limit,
      totalEntries: 100,
      tableRows: [page1, page2][Math.floor(offset / limit)],
    }))

    const view = render(<PageWithState />);
    await waitFor(() => expect(view.baseElement.querySelector('.ant-pagination-item-2')).toBeTruthy());
    await userEvent.click(view.baseElement.querySelector('.ant-pagination-item-2') as HTMLElement);
    await waitFor(() => expect(view.getAllByDominoTestId('WorkspaceTitle').length).toBeGreaterThan(0));
    const foundNames = view.getAllByDominoTestId('WorkspaceTitle').map(x => x.textContent).join();
    const actualNames = page2.map(workspace => workspace.name).join();
    expect(foundNames).toBe(actualNames);

  });

  it('should show all rows on initial page if page size is larger than found workspaces', async () => {
    const smallPage = Array(10).fill(null).map((x, n) => createWorkspace(n.toString()));
    getAdminDashboardRowData.mockImplementation(async ({ offset, limit }: { offset: number, limit: number }) =>  ({
      offset,
      limit,
      totalEntries: smallPage.length,
      tableRows: smallPage,
    }))

    const view = render(<PageWithState />);
    await waitFor(() => expect(view.getAllByDominoTestId('WorkspaceTitle').length).toBeGreaterThan(0));
    const foundNames = view.getAllByDominoTestId('WorkspaceTitle').map(x => x.textContent).join();
    const actualNames = smallPage.map(workspace => workspace.name).join();
    expect(foundNames).toBe(actualNames)
  });

  it('should disable pagination controlls if all data is less than default page size', async () => {
    const smallPage = Array(10).fill(null).map((x, n) => createWorkspace(n.toString()));
    getAdminDashboardRowData.mockImplementation(async ({ offset, limit }: { offset: number, limit: number }) =>  ({
        offset,
        limit,
        totalEntries: smallPage.length,
        tableRows: smallPage,
    }));

    const view = render(<PageWithState />);
    await waitFor(() => expect(view.baseElement.querySelectorAll('tbody tr').length).toBeGreaterThan(1));
    const prevLabel = view.container.getElementsByClassName('ant-pagination-prev')[0];
    const nextLabel = view.container.getElementsByClassName('ant-pagination-next')[0];
    expect(prevLabel.getAttribute('class')).toContain('ant-pagination-disabled');
    expect(nextLabel.getAttribute('class')).toContain('ant-pagination-disabled');
  });
});
