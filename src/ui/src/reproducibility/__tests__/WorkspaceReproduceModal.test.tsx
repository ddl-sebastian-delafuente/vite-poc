import * as React from 'react';
import 'jest-styled-components';
import {
  render, fullClick, within, waitFor, fireEvent
} from '@domino/test-utils/dist/testing-library';
import * as Workspace from '@domino/api/dist/Workspace';
import * as Gateway from '@domino/api/dist/Gateway';
import * as Projects from '@domino/api/dist/Projects';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import { workspaceDto } from '@domino/test-utils/dist/mocks';
import * as mockTestUtil from '../../utils/testUtil';
import * as Helpers from '../../components/renderers/helpers';
import WorkspaceReproduceModal, { WorkspaceReproduceModalProps } from '../WorkspaceReproduceModal';
import * as testUtil from './testUtil';
import  userEvent from '@testing-library/user-event';

const {
  ProjectDetails,
  getModalButton,
  mockCheckpoint,
  mockProjectSettings,
  getQuotaMock,
  BRANCH_COMMIT_DETAILS
} = testUtil;

let findProjectByOwnerAndName: jest.SpyInstance;
let getErrorMessage: jest.SpyInstance;
let getProjectSettings: jest.SpyInstance;
let listHardwareTiersForProject: jest.SpyInstance;
let quotaStatus: jest.SpyInstance;
let updateProjectSettings: jest.SpyInstance;
let mocks: jest.SpyInstance[];

beforeAll(() => {
  findProjectByOwnerAndName = jest.spyOn(Gateway, 'findProjectByOwnerAndName').mockResolvedValue(mockTestUtil.project);
  getErrorMessage = jest.spyOn(Helpers, 'getErrorMessage').mockResolvedValue('dummy resolution');
  getProjectSettings = jest.spyOn(Projects, 'getProjectSettings').mockResolvedValue(mockProjectSettings);
  listHardwareTiersForProject = jest.spyOn(Projects, 'listHardwareTiersForProject').mockResolvedValue(mockTestUtil.hardwareTierData);
  quotaStatus = getQuotaMock();
  updateProjectSettings = jest.spyOn(Projects, 'updateProjectSettings').mockResolvedValue({});

  mocks = [
    findProjectByOwnerAndName,
    getErrorMessage,
    getProjectSettings,
    listHardwareTiersForProject,
    quotaStatus,
    updateProjectSettings,
  ]
});

afterAll(() => unmockMocks(mocks));

describe(`WorkspaceReproduceModal for checkpointed workspaces`, () => {
  const defaultProps: WorkspaceReproduceModalProps = {
    ModalButton: getModalButton,
    isGitBasedProject: false,
    projectId: ProjectDetails.projectId,
    envName: 'test-env',
    onSubmit: jest.fn(),
    checkpoint: mockCheckpoint,
    workspaceReproductionType: 'FromWorkspace',
  };

  test(`should render 'BranchNameInformation' component`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('branch-name-information')).toBeTruthy());
  });

  test(`should render 'DataSetInfoBox' component`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('datasets-info-box')).toBeTruthy());
  });

  test(`should render workspace name form item and have "restarted-" as prefix`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceName = getByDominoTestId('new-workspace-name');
    expect(workspaceName.getAttribute('value')?.startsWith('restarted-')).toBeTruthy();
  });

  test(`should persist workspace and branch name text fields after closing and re-opening modal`, async () => {
    // open modal and fill in some workspace and branch names
    const { getByDominoTestId, queryByDominoTestId, baseElement } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceNameInput = getByDominoTestId('new-workspace-name');
    fireEvent.change(workspaceNameInput, {target: {value: 'ws-name'}});
    const branchNameInput = getByDominoTestId('new-branch-name');
    fireEvent.change(branchNameInput, {target: {value: 'branch-name'}});
    
    // close and re-open modal, then verify textfield values are unchanged
    const closeButton = baseElement.querySelector<HTMLElement>('.ant-modal-close');
    expect(closeButton).toBeTruthy();
    fullClick(closeButton as HTMLElement);
    fullClick(modalButton);
    await waitFor(() => expect(workspaceNameInput.getAttribute('value')).toEqual('ws-name'));
    await waitFor(() => expect(branchNameInput.getAttribute('value')).toEqual('branch-name'));
  });

  test(`should render hardware tier selector form item`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('hardware-tier')).toBeTruthy());
    const hardwareTier = getByDominoTestId('hardware-tier');
    expect(within(hardwareTier).getByText('Choose a hardware tier')).toBeTruthy();
  });

  test(`should render branch name form item with "restarted-" as prefix`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-branch-name')).toBeTruthy());
    const branchName = getByDominoTestId('new-branch-name');
    expect(branchName.getAttribute('value')?.startsWith('restarted-')).toBeTruthy();
  });

  test('should render details card with environment name, file commit and artifact details\
  for a DFS project having imported projects', async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('environmentName')).toBeTruthy());
    expect(getByDominoTestId('environmentName').textContent).toEqual('test-env - Revision #123');

    // file details
    const filesDetails = getByDominoTestId('files');
    BRANCH_COMMIT_DETAILS.commits.forEach(commitInfo => expect(within(filesDetails)
      .getAllByText(new RegExp(commitInfo.slice(0, 7))).length).toBeGreaterThanOrEqual(1));
    BRANCH_COMMIT_DETAILS.commitDetails.forEach(commitInfo => expect(within(filesDetails)
      .getAllByText(new RegExp(commitInfo)).length).toBeGreaterThanOrEqual(1));
    
    // artifact details
    const artifactDetails = getByDominoTestId('artifacts');
    expect(within(artifactDetails).getAllByText(new RegExp(ProjectDetails.projectName))).toHaveLength(2);
    mockCheckpoint.importedProjects.forEach(importedProject =>
      expect(within(artifactDetails).getByText(new RegExp(importedProject.commitId.slice(0, 7)))).toBeTruthy());
  });

  test('should render details card with environment name, \
  code commit and artifact details for a GBP having imported projects', async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} isGitBasedProject={true} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('environmentName')).toBeTruthy());
    expect(getByDominoTestId('environmentName').textContent).toEqual('test-env - Revision #123');
    
    // code details
    const codeDetails = getByDominoTestId('code');
    BRANCH_COMMIT_DETAILS.commits.forEach(commitInfo => expect(within(codeDetails)
      .getAllByText(new RegExp(commitInfo.slice(0, 7))).length).toBeGreaterThanOrEqual(1));
    BRANCH_COMMIT_DETAILS.commitDetails.slice(2).forEach(commitInfo => expect(within(codeDetails)
      .getAllByText(new RegExp(commitInfo)).length).toBeGreaterThanOrEqual(1));
    
    // artifact details
    const artifactDetails = getByDominoTestId('artifacts');
    expect(within(artifactDetails).getAllByText(new RegExp(ProjectDetails.projectName))).toHaveLength(2);
    mockCheckpoint.importedProjects.forEach(importedProject =>
      expect(within(artifactDetails).getByText(new RegExp(importedProject.commitId.slice(0, 7)))).toBeTruthy());
  });

  test(`should call 'reproduceAndStartWorkspace' when clicked on 'Open' button`, async () => {
    const reproduceWorkspaceApiMock = jest.spyOn(Workspace, 'reproduceAndStartWorkspace');
    reproduceWorkspaceApiMock.mockImplementation(async () => ({ ...workspaceDto, ...mockTestUtil.workspace }));
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('reproduce-workspace-submit-button')).toBeTruthy());
    const openButton = getByDominoTestId('reproduce-workspace-submit-button');
    fullClick(openButton);
    await waitFor(() => expect(reproduceWorkspaceApiMock).toHaveBeenCalled());
  });

});
