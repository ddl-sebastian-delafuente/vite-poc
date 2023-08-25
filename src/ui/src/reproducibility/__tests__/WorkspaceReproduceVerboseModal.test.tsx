import * as React from 'react';
import 'jest-styled-components';
import {
  render, waitFor, within, screen, configure, fireEvent, fullClick
} from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import * as Workspace from '@domino/api/dist/Workspace';
import * as Workspaces from '@domino/api/dist/Workspaces';
import * as Gateway from '@domino/api/dist/Gateway';
import * as Projects from '@domino/api/dist/Projects';
import * as Helpers from '../../components/renderers/helpers';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import * as mockTestUtil from '@domino/ui/dist/utils/testUtil';
import * as testUtil from './testUtil';
import WorkspaceReproduceVerboseModal, { Props as VerboseModalProps } from '../WorkspaceReproduceVerboseModal';
import { workspaceDto } from '@domino/test-utils/dist/mocks';

const {
  ProjectDetails,
  getModalButton,
  mockProjectSettings,
  getQuotaMock,
  mockWorkspaceTools,
  mockWorkspaceDefinitions
} = testUtil;

let findProjectByOwnerAndName: jest.SpyInstance;
let getErrorMessage: jest.SpyInstance;
let getProjectSettings: jest.SpyInstance;
let listHardwareTiersForProject: jest.SpyInstance;
let quotaStatus: jest.SpyInstance;
let updateProjectSettings: jest.SpyInstance;
let getAvailableToolsForEnvironment: jest.SpyInstance;
let getAvailableWorkspaceDefinitions: jest.SpyInstance;
let mocks: jest.SpyInstance[];

beforeAll(() => {
  findProjectByOwnerAndName = jest.spyOn(Gateway, 'findProjectByOwnerAndName').mockResolvedValue(mockTestUtil.project);
  getErrorMessage = jest.spyOn(Helpers, 'getErrorMessage').mockResolvedValue('dummy resolution');
  getProjectSettings = jest.spyOn(Projects, 'getProjectSettings').mockResolvedValue(mockProjectSettings);
  listHardwareTiersForProject = jest.spyOn(Projects, 'listHardwareTiersForProject').mockResolvedValue(mockTestUtil.hardwareTierData);
  quotaStatus = getQuotaMock();
  updateProjectSettings = jest.spyOn(Projects, 'updateProjectSettings').mockResolvedValue({});
  getAvailableToolsForEnvironment = jest.spyOn(Workspaces, 'getAvailableToolsForEnvironment').mockResolvedValue(mockWorkspaceTools);
  getAvailableWorkspaceDefinitions = jest.spyOn(Workspaces, 'getAvailableWorkspaceDefinitions').mockResolvedValue(mockWorkspaceDefinitions);
  jest.mock('@domino/api/dist/Workspace');
  
  mocks = [
    findProjectByOwnerAndName,
    getErrorMessage,
    getProjectSettings,
    listHardwareTiersForProject,
    quotaStatus,
    updateProjectSettings,
    getAvailableToolsForEnvironment,
    getAvailableWorkspaceDefinitions
  ];
});

afterAll(() => {
  unmockMocks(mocks);
  jest.unmock('@domino/api/dist/Workspace');
});

const changeValueAndAssert = async (
  changeElement: HTMLInputElement,
  assertElement: HTMLInputElement,
  changeValue: string,
  assertion: string
) => {
  await userEvent.clear(changeElement);
  await userEvent.type(changeElement, changeValue);
  await waitFor(() => expect(assertElement.getAttribute('value')).toEqual(assertion));
};

describe(`WorkspaceReproduceVerboseModal for non-checkpointed workspaces`, () => {
  configure({ testIdAttribute: 'data-test' });
  const defaultProps: VerboseModalProps = {
    projectId: ProjectDetails.projectId,
    ModalButton: getModalButton,
    envName: 'test-env',
    envRevisionNumber: 10,
    envId: '0123456789abcdefg',
    isGitBasedProject: false,
    dfsCommitId: 'abcdefghijklmnopqrstuvxyz0987654321',
    gitRepoCommits: [],
    onSubmit: jest.fn(),
  };

  test(`should render 'BranchNameInformation' component`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('branch-name-information')).toBeTruthy());
  });

  test(`should render 'DataSetInfoBox' component`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('datasets-info-box')).toBeTruthy());
  });

  test(`should render workspace name form item without any value by default`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceNameValue = getByDominoTestId('new-workspace-name').getAttribute('value');
    expect(workspaceNameValue).toHaveLength(0);
    expect(workspaceNameValue).toEqual('');
  });

  test('should render Workspace Definition Selector with the 1st option as the checked\
  radio option by default, and none of the remaining options should be selected', async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('workspace-ide')).toBeTruthy());
    const workspaceDefinitionSelector = getByDominoTestId('workspace-ide');
    const [firstWsOption, ...remainingWsOptions] = within(workspaceDefinitionSelector).getAllByTestId(/name[0-9]/);
    expect(firstWsOption.parentElement!.getAttribute('class')).toContain('ant-radio-button-checked'); // true only for the first radio input
    remainingWsOptions.forEach(wsOption => expect(wsOption.parentElement!.getAttribute('class')).not.toContain('ant-radio-button-checked'));
  });

  test(`should render hardware tier selector form item`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('hardware-tier')).toBeTruthy());
    const hardwareTier = getByDominoTestId('hardware-tier');
    expect(within(hardwareTier).getByText('Choose a hardware tier')).toBeTruthy();
  });

  test(`should render branch name form item without any value by default`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-branch-name')).toBeTruthy());
    const branchNameValue = getByDominoTestId('new-branch-name').getAttribute('value');
    expect(branchNameValue).toHaveLength(0);
    expect(branchNameValue).toEqual('');
  });

  test(`should test branch name change w.r.t workspace name changes`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceNameElement = getByDominoTestId('new-workspace-name') as HTMLInputElement;
    const branchNameElement = getByDominoTestId('new-branch-name') as HTMLInputElement;
    await changeValueAndAssert(workspaceNameElement, branchNameElement, 'new workspace', 'new-workspace');
    await changeValueAndAssert(workspaceNameElement, branchNameElement, '   ----new ---workspace-----   ', 'new-workspace');
    await changeValueAndAssert(workspaceNameElement, branchNameElement, '$$$   this is ###workspace   $$$$///', 'this-is-workspace');
    await changeValueAndAssert(workspaceNameElement, branchNameElement, 'this is workspace 1234 ------', 'this-is-workspace-1234');
    await changeValueAndAssert(workspaceNameElement, branchNameElement, '------------', '');
  }, 15000); // test takes > 5000ms to pass

  test(`should not change workspace name when branch name changes`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceNameElement = getByDominoTestId('new-workspace-name') as HTMLInputElement;
    const branchNameElement = getByDominoTestId('new-branch-name') as HTMLInputElement;
    await changeValueAndAssert(workspaceNameElement, branchNameElement, 'new workspace', 'new-workspace');
    await changeValueAndAssert(branchNameElement, workspaceNameElement, 'new-workspace-branch-name-changed', 'new workspace');
  });

  test('should not reflect changes to branch name when workspace name is changed once after branch name is directly changed', async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceNameElement = getByDominoTestId('new-workspace-name') as HTMLInputElement;
    const branchNameElement = getByDominoTestId('new-branch-name') as HTMLInputElement;
    await changeValueAndAssert(workspaceNameElement, branchNameElement, 'new workspace', 'new-workspace');
    await userEvent.type(branchNameElement, 'new-workspace-branch-name-changed');
    await userEvent.type(workspaceNameElement, 'new workspace spark');
    expect(branchNameElement.getAttribute('value')).not.toContain('spark');
  }, 10000); // test takes > 5000ms to pass

  test(`should show inline error when workspace/branch names are empty after changes to them respectively`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceNameElement = getByDominoTestId('new-workspace-name') as HTMLInputElement;
    const branchNameElement = getByDominoTestId('new-branch-name') as HTMLInputElement;
    await changeValueAndAssert(workspaceNameElement, branchNameElement, 'new workspace', 'new-workspace');
    await userEvent.clear(workspaceNameElement);
    await waitFor(() => expect(screen.getByText('Please enter Workspace name')).toBeTruthy());
    await waitFor(() => expect(screen.getByText('Please enter branch name')).toBeTruthy());
  });

  test(`should render details card with environment name and file commits for a DFS project`, async () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    
    // environment details
    await waitFor(() => expect(queryByDominoTestId('environmentName')?.textContent)
      .toEqual(`${defaultProps.envName} - Revision #${defaultProps.envRevisionNumber}`));
    
    // file details
    await waitFor(() => expect(queryByDominoTestId('filesCommitId')?.textContent)
      .toEqual(`Files Commit: ${defaultProps.dfsCommitId.slice(0, 7)}`));
  });

  test('should render details card with environment name, code commit and artifact details for a GBP', async () => {
    const gitRepoCommits = [{
      repoId: "1l2k3j12k",
      repoName: "myRepo",
      commitId: "zyxdefghijklmnopqrstuvxyz0987654321",
      isMainRepo: true
    }]
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} isGitBasedProject={true} gitRepoCommits={gitRepoCommits} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    
    // environment details
    await waitFor(() => expect(queryByDominoTestId('environmentName')?.textContent)
      .toEqual(`${defaultProps.envName} - Revision #${defaultProps.envRevisionNumber}`));
    
    // code details
    await waitFor(() => expect(queryByDominoTestId('codeCommitId')?.textContent)
      .toContain(gitRepoCommits[0].commitId.slice(0, 7)));
  });

  test(`should call 'createAndStartWorkspace' when clicked on 'Open' button`, async () => {
    const createWorkspaceApiMock = jest.spyOn(Workspace, 'createAndStartWorkspace');
    createWorkspaceApiMock.mockImplementation(async () => ({ ...workspaceDto, ...mockTestUtil.workspace }));
    const { getByDominoTestId, queryByDominoTestId } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(getByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
    await userEvent.click(modalButton);
    await waitFor(() => expect(queryByDominoTestId('new-workspace-name')).toBeTruthy());
    const workspaceNameElement = getByDominoTestId('new-workspace-name') as HTMLInputElement;
    await userEvent.clear(workspaceNameElement);
    await userEvent.type(workspaceNameElement, 'New Workspace');
    await waitFor(() => expect(workspaceNameElement.getAttribute('value')).toEqual('New Workspace'));
    await waitFor(() => expect(getByDominoTestId('new-branch-name').getAttribute('value')).toEqual('New-Workspace'));
    const OpenButton = getByDominoTestId('reproduce-workspace-submit-button');
    expect(OpenButton.hasAttribute('disabled')).toBeFalsy();
    await userEvent.click(OpenButton);
    await waitFor(() => expect(createWorkspaceApiMock).toHaveBeenCalled());
  });

  test(`should persist workspace and branch name text fields after closing and re-opening modal`, async () => {
    // open modal and fill in some workspace and branch names
    const { getByDominoTestId, queryByDominoTestId, baseElement } = render(<WorkspaceReproduceVerboseModal {...defaultProps} />);
    await waitFor(() => expect(queryByDominoTestId('workspace-reproduce-verbose-modal')).toBeTruthy());
    const modalButton = getByDominoTestId('workspace-reproduce-verbose-modal');
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
});
