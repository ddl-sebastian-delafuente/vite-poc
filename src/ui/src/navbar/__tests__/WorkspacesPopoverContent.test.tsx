import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor, screen } from '@domino/test-utils/dist/testing-library';
import * as workspaceAPI from '@domino/api/dist/Workspace';
import * as datamountAPI from '@domino/api/dist/Datamount';
import {
  DominoWorkspaceApiWorkspaceDto as WorkspaceDto,
  DominoWorkspaceApiWorkspaceSessionDto as WorkspaceSessionDto,
  DominoWorkspaceApiQueuedWorkspaceHistoryDetails as WorkspaceHistoryDetails
} from '@domino/api/dist/types';
import WorkspacesPopoverContent from '../components/WorkspacesPopoverContent';
import { project } from './Navbar.test';
import * as workspaceUtils from '../../utils/workspaceUtil';

export const workspaceHistoryDetails: WorkspaceHistoryDetails = {
  expectedWait: 'now',
  explanation: 'Your workspace has been deployed to default.',
  helpText: 'It will start being prepared for execution momentarily.'
};

describe('<WorkspacesPopoverContent />', () => {
  const mockRecentSession: WorkspaceSessionDto = {
    id: 'id',
    executionId: 'executionId',
    config: {
      'environment': {
        'id': '5f365bf8c981e722bd2a1aa1',
        'name': 'Default',
        'revisionId': '5f365bf8c981e722bd2a1aa1',
        'revisionNumber': 1,
        'revisionType': 'Active',
        isRestricted: false,
      },
      'hardwareTier': {
        'id': {
          'value': 'kubernetes'
        },
        'name': 'hardware tier name'
      },
      'tools': ['jupyter']
    },
    datasetMounts: [],
    externalVolumeMounts: [],
    queuedWorkspaceHistoryDetails: workspaceHistoryDetails,
    sessionStatusInfo: {
      rawExecutionDisplayStatus: 'Running',
      rawExecutionDisplayStatusUpdatedAt: '2020-03-05T07:18:48.654Z',
      isLoading: false,
      isRunning: true,
      isStoppable: true,
      isCompleting: false,
      isFailed: false,
      isSuccessful: false,
      isCompleted: false
    },
    start: {time: 123}
  };

  const genericWorkspaceProps: WorkspaceDto = {
    id: 'workspaceId',
    deleted: false,
    projectId: 'projectId',
    ownerId: 'ownerId',
    ownerName: 'ownerName',
    name: 'workspaceName',
    state: 'Running',
    stateUpdatedAt: 'stateUpdatedAt',
    initConfig: {
      'volumeSize': { value: 200, unit: 'GiB' }
    },
    configTemplate: {
      'environment': {
        'id': '5f365bf8c981e722bd2a1aa1',
        'name': 'Default',
        'revisionId': '5f365bf8c981e722bd2a1aa1',
        'revisionNumber': 1,
        'revisionType': 'Active',
        isRestricted: false,
      },
      'hardwareTier': {
        'id': {
          'value': 'kubernetes'
        },
        'name': 'hardware tier name'
      },
      'tools': ['jupyter']
    },
    mostRecentSession: mockRecentSession,
    sessionStats: {
      'runTimeSec': 0
    },
    createdAt: 'createdAt',
    importedProjects: [],
    importedGitRepos: [],
    dataPlaneId: '5f44ee5f172fdf43f700b0a5',
    isLegacy: false,
    isReproduced: false
  };

  const mockOwnerWorkspaces = [
    {
      ...genericWorkspaceProps,
      id: 'workspaceId1',
    },
    {
      ...genericWorkspaceProps,
      id: 'workspaceId2',
      state: 'Stopped',
      mostRecentSession: {
        ...mockRecentSession,
        sessionStatusInfo: {
          rawExecutionDisplayStatus: 'Stopped',
          rawExecutionDisplayStatusUpdatedAt: '2020-03-05T07:18:48.654Z',
          isLoading: false,
          isRunning: false,
          isStoppable: false,
          isCompleting: false,
          isFailed: false,
          isSuccessful: true,
          isCompleted: true
        },
      },
    },
    {
      ...genericWorkspaceProps,
      id: 'workspaceId3',
      state: 'Error',
      mostRecentSession: {
        ...mockRecentSession,
        sessionStatusInfo: {
          rawExecutionDisplayStatus: 'Stopped',
          rawExecutionDisplayStatusUpdatedAt: '2020-03-05T07:18:48.654Z',
          isLoading: false,
          isRunning: false,
          isStoppable: false,
          isCompleting: false,
          isFailed: true,
          isSuccessful: false,
          isCompleted: true
        },
      },
    },
  ];

  const startWorkspaceSession = jest.spyOn(workspaceAPI, 'startWorkspaceSession');
  startWorkspaceSession.mockImplementation(jest.fn());

  const mockDataMountsPromise = Promise.resolve([]);
  const findDataMountsByProject = jest.spyOn(datamountAPI, 'findDataMountsByProject');
  findDataMountsByProject.mockImplementation(() => mockDataMountsPromise);

  const openWorkspaceSession = jest.spyOn(workspaceUtils, 'openWorkspaceSession');
  openWorkspaceSession.mockImplementation(jest.fn());

  let view: any;

  beforeEach(() => {
    view = render(
      <WorkspacesPopoverContent
        enableExternalDataVolumes={true}
        project={project}
        restartableWorkspaces={mockOwnerWorkspaces}
        viewMoreWorkspaces={false}
        userName="userName"
      />
    );
  });

  afterEach(() => {
    view.unmount()
  });

  test('renders list of workspaces', async () => {
    await waitFor(() => expect(view.baseElement.querySelectorAll('li[data-test^="WSLISTITEM"]')).toHaveLength(mockOwnerWorkspaces.length))
  });

  describe('See More option', () => {
    test(`should be visible when 'viewMoreWorkspaces' is true`, async () => {
      render(
        <WorkspacesPopoverContent
          enableExternalDataVolumes={true}
          project={project}
          restartableWorkspaces={mockOwnerWorkspaces}
          viewMoreWorkspaces={true}
          userName="userName"
        />
      );
      await waitFor(() => expect(screen.getByText('See More')).toBeTruthy());
    });
  });

  test(`
    shouldn't call workspace launch related methods when a workspace with 'Failed/Error' status is clicked`, async () => {
    const failedWorkspace = mockOwnerWorkspaces.find((ws) => ws.state === 'Error');
    const failedWorkspaceListItem = view.baseElement.querySelector(`li[data-test="WSLISTITEM-${failedWorkspace!.id}"]`);
    await userEvent.click(failedWorkspaceListItem);
    expect(startWorkspaceSession).not.toHaveBeenCalled();
    expect(openWorkspaceSession).not.toHaveBeenCalled();
  });

  test(`should call 'startWorkspaceSession' on clicking a workspace in 'Stopped' state`, async () => {
    const stoppedWorkspace = mockOwnerWorkspaces.find((ws) => ws.state === 'Stopped');
    const stoppedWorkspaceListItem = view.baseElement.querySelector(`li[data-test="WSLISTITEM-${stoppedWorkspace!.id}"]`);
    await userEvent.click(stoppedWorkspaceListItem);
    await mockDataMountsPromise;
    expect(startWorkspaceSession).toHaveBeenCalled();
  });

  test(`should call 'openWorkspaceSession' on clicking a workspace in 'Running' state`, async () => {
    const runningWorkspace = mockOwnerWorkspaces.find((ws) => ws.state === 'Running');
    const runningWorkspaceListItem = view.baseElement.querySelector(`li[data-test="WSLISTITEM-${runningWorkspace!.id}"]`);
    await userEvent.click(runningWorkspaceListItem);
    expect(openWorkspaceSession).toHaveBeenCalled();
  });
});
