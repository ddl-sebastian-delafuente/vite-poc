import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import {
  DominoJobsInterfaceJobResourcesStatus as RunResourcesStatus
} from '@domino/api/dist/types';
import * as Gateway from '@domino/api/dist/Gateway';
import * as Workspaces from '@domino/api/dist/Workspaces';
import { projectGatewayOverview } from '@domino/test-utils/dist/mocks';
import ConfirmStopRunModal from '../../src/runs/ConfirmStopRunModal';

const runId = 'fakerunid';
const projectName = 'fakeprojectname';
const projectOwnerName = 'fakeusername';
const projectId = 'fakeprojectid';
const workloadType = 'Workspace';

const getMountedConfirmStopRunModal = (isRunning = true) =>
  render(
    <ConfirmStopRunModal
      isRunning={isRunning}
      runId={runId}
      ownerUsername={projectOwnerName}
      projectName={projectName}
      workloadType={workloadType}
      projectId={projectId}
    />
  );

const getWorkspacesApiMocks = () => {
  const stopWorkspaceSaveChanges = jest.spyOn(Workspaces, 'stopWorkspaceSaveChanges');
  const stopWorkspaceDiscardChanges = jest.spyOn(Workspaces, 'stopWorkspaceDiscardChanges');
  const getWorkspaceRepositoryStatus = jest.spyOn(Workspaces, 'getWorkspaceRepositoryStatus');
  return {
    withSuccessfullStop: () => {
      stopWorkspaceSaveChanges.mockImplementation(async () => 'true');
      stopWorkspaceDiscardChanges.mockImplementation(async () => 'true');
    },
    getResourcesStatus: (returnValue: RunResourcesStatus) => {
      getWorkspaceRepositoryStatus.mockImplementation(async () => returnValue);
    }
  };
};

jest.mock('@domino/api/dist/Workspaces');
jest.mock('@domino/api/dist/Gateway');
const workspacesApiMocks = getWorkspacesApiMocks();
const findProjectByOwnerAndName = jest.spyOn(Gateway, 'findProjectByOwnerAndName');
findProjectByOwnerAndName.mockImplementation(() => Promise.resolve({ 
  ...projectGatewayOverview,
  id: projectId
}));

afterAll(() => {
  jest.unmock('@domino/api/dist/Workspaces');
  jest.unmock('@domino/api/dist/Gateway');
  jest.restoreAllMocks();
  jest.resetModules();
});

test(`if run is not running, don't show modal on button click`, async () => {
  workspacesApiMocks.withSuccessfullStop();
  workspacesApiMocks.getResourcesStatus({ repositories: [] });
  const view = getMountedConfirmStopRunModal(false);
  await userEvent.click(view.getByText('Stop'));
  await waitFor(() => expect(view.queryByDominoTestId('confirm-stop-run-modal')).toBeFalsy());
});

test(`if there are no repo changes and statuses of repos are all known, don't show modal on click`, async () => {
  workspacesApiMocks.withSuccessfullStop();
  workspacesApiMocks.getResourcesStatus({
    repositories: [
      { 'name': 'A', 'status': 'Clean' },
      { 'name': 'B', 'status': 'Clean' },
    ]});
  const view = getMountedConfirmStopRunModal();
  await userEvent.click(view.getByText('Stop'));
  await waitFor(() => expect(view.queryByDominoTestId('confirm-stop-run-modal')).toBeFalsy());
});

test('if the status of any repo is unknown, show confirmation modal on click', async () => {
  workspacesApiMocks.withSuccessfullStop();
  workspacesApiMocks.getResourcesStatus({
    repositories: [
      { 'name': 'A', 'status': 'Clean' },
      { 'name': 'B', 'status': 'Unknown' },
    ]});
  const view = getMountedConfirmStopRunModal();
  await userEvent.click(view.getByText('Stop'), { pointerEventsCheck: 0 });
  await waitFor(() => expect(view.queryByDominoTestId('confirm-stop-run-modal')).toBeTruthy());
});
