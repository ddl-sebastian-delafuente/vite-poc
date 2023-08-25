import * as React from 'react';
import * as R from 'ramda';
import 'jest-styled-components';
import { MemoryRouter as Router } from 'react-router';
import userEvent from '@testing-library/user-event';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';
import { fullClick, render, waitFor, within, configure, fireEvent } from '@domino/test-utils/dist/testing-library';
import { AccessControlProvider } from '@domino/ui/dist/core/AccessControlProvider';
import JobsLauncher from '../Form/JobsLauncher';
import JobsLauncherView from '../Form/JobsLauncherView';
import {
  project,
  hardwareTierData,
  mockRevisions,
  mockEnvironment,
  mockUsableEnvs,
  getUseableEnvironmentsSelectedNotOnDemandSpark,
  mockProjectSettings,
  fileSearchMock,
} from '../../utils/testUtil';
import { MISSING_FILE_OR_COMMAND_MESSAGE } from '../components/FileNameInputFormItem';
import GlobalStore from '../../globalStore/GlobalStore';
import storageKeys from '../../globalStore/storageKeys';
import { projectSettings } from '../../core/routes';

const defaultVolumeSizeGiB = 5;

const recommendedVolumeSizeGiB = 8;

const mockProfile: MockProfile = {
  admin: {
    getWhiteLabelConfigurations: {},
  },
  auth: {
    getPrincipal: {
      featureFlags: [
        'ShortLived.FastStartDataSets',
        'ShortLived.MultipleComputeClustersEnabled',
        'ShortLived.EnableEnvironmentRevisions',
        'ShortLived.EnableDiskUsageVolumeCheck'
      ],
      booleanSettings: []
    }
  },
  environments: {
    getBuiltEnvironmentRevisions: mockRevisions,
    getEnvironmentById: mockEnvironment,
  },
  projects: {
    getUseableEnvironments: mockUsableEnvs,
    getUseableEnvironmentDetails: getUseableEnvironmentsSelectedNotOnDemandSpark,
    getProjectSettings: mockProjectSettings,
    listHardwareTiersForProject: hardwareTierData
  },
  users: {
    getCurrentUser: {},
    isDataAnalystUser: false,
  },
  workspace: {
    createAndStartWorkspace: {}
  },
  datamount: {
    findDataMountsByProject: {}
  },
  jobs: {
    getDefaultComputeClusterSettings: {}
  },
  files: {
    fileSearch: fileSearchMock
  }
};

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(mockProfile);
});

afterAll(() => {
  mocks.unmock();
});

describe(`JobsLauncher`, () => {
  const defaultJobsLauncherProps = {
    handleSubmit: jest.fn(),
    handleCancel: jest.fn(),
    project: project,
    projectId: 'projectId',
    startNewJob: jest.fn(),
    isModalVisible: true,
    areMultipleClustersEnabled: true,
    hasGitCredentials: true
  };

  it('should render', async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncher
            {...defaultJobsLauncherProps}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(view.getAllByDominoTestId('jobs-launcher')[0]).toBeTruthy());
  });

  it(`should NOT render 'ExecutionStepFormElements' component if there is no project`, async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncher
            {...R.omit(['project', 'projectId'], defaultJobsLauncherProps)}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('step-1-content').firstElementChild!.firstElementChild).toBeFalsy());
  });

  it(`should NOT render 'DatasetsStepContent' component if there is no project`, async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncher
            {...R.omit(['project', 'projectId'], defaultJobsLauncherProps)}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('step-3-content').firstElementChild).toBeFalsy());
  });

  it(`should NOT render 'ClusterContent' component if there is no project`, async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncher
            {...R.omit(['project', 'projectId'], defaultJobsLauncherProps)}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('step-2-content').firstElementChild).toBeFalsy());
  });

  it(`should submit job title to API when its value exists`, async () => {
    const jobTitleInput = 'title 1';
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncher
            {...defaultJobsLauncherProps}

          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(view.getAllByDominoTestId('jobs-launcher')[0]).toBeTruthy());
    await userEvent.type(view.getByDominoTestId('job-title-textinput'), jobTitleInput);
    await userEvent.type(within(view.getByDominoTestId('command-to-run')).getByRole('combobox'), 'main.py');
    await waitFor(() => expect(view.getByText('test-clone-clone-clone')).toBeTruthy());
    const step3Jump = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Jump);
    const startButton = view.getByDominoTestId('step-2-change');
    fullClick(startButton);
    await waitFor(() => expect(defaultJobsLauncherProps.startNewJob).toHaveBeenCalledWith(expect.objectContaining({ title: jobTitleInput })));
  });
});

describe(`JobsLauncherView`, () => {
  const defaultJobsLauncherViewProps = {
    project: project,
    submitText: 'Start' as const,
    externalVolumeMounts: [],
    isGitBasedProject: false,
    environmentId: '5e1777a02d7e787f46eec3b1',
    commandToRun: 'main.py',
    hardwareTierId: hardwareTierData[0].hardwareTier.id,
    onCancel: jest.fn(),
    handleSubmit: jest.fn(),
    handleDatasetConfigChange: jest.fn(),
    onCommandToRunPrefixChange: jest.fn(),
    onDatasetsFetch: jest.fn(),
    onEnvironmentChange: jest.fn(),
    onHardwareTierChange: jest.fn(),
    onClusterConfigChange: jest.fn(),
    onCommandToRunChange: jest.fn(),
    onGitRefChange: jest.fn(),
    currentUserName: 'Anonymous',
    handleEnvRevisionSelect: jest.fn(),
    isCommandToRunTouched: false,
    isHardwareTierTouched: false,
    isEnvironmentTouched: false,
    isGitRefValueTouched: false,
    touchAllFields: jest.fn(),
    handleVolumeSizeChange: jest.fn(),
    setRecommendedVolumeSizeGiB: jest.fn(),
    setDefaultVolumeSizeGiB: jest.fn(),
    defaultVolumeSizeGiB: 0,
    selectedDataPlaneId: "000000000000000000000000",
    allowDatasetSnapshotsOnExecutionCompletion: false,
    setJobTitle: jest.fn(),
  };

  // functions in DOM Testing Library use the attribute data-testid by default
  // we can override this value via configure({testIdAttribute: 'data-my-test-attribute'})
  // https://testing-library.com/docs/queries/bytestid/#overriding-data-testid
  configure({ testIdAttribute: 'data-test' });

  it('should display volume size selector in the first step', async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...defaultJobsLauncherViewProps}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(within(view.getByDominoTestId('step-1-content')).getByTestId('volume-size')).toBeTruthy());
  });

  it('should display job title input in the first step', async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...defaultJobsLauncherViewProps}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('job-title-textinput')).toBeTruthy());
  });

  it('should render a tooltip when hovering on `Volume Size` title which should have a link that redirects to `Project Settings` page', async () => {
    const view = render(
      <Router>
        <JobsLauncherView {...defaultJobsLauncherViewProps} />
      </Router>
    );
    await waitFor(() => expect(within(view.getByDominoTestId('step-1-content')).getByTestId('volume-size')).toBeTruthy());
    const volumeSizeTitle = view.getByText(/Volume Size/);
    fireEvent.mouseOver(volumeSizeTitle);
    await waitFor(() => expect(view.getByText(/Project Settings/)).toBeTruthy());
    const linkToProjectSettings = view.getByText(/Project Settings/);
    const { name: projectName, owner: { userName: ownerUserName } } = project;
    expect(linkToProjectSettings.getAttribute('href')).toEqual(projectSettings('execution')(ownerUserName, projectName));
  });

  it('should display the values fetch from project settings API in the default and recommended options for volume selector', async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...defaultJobsLauncherViewProps}
            defaultVolumeSizeGiB={defaultVolumeSizeGiB}
            recommendedVolumeSizeGiB={recommendedVolumeSizeGiB}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(within(view.getByDominoTestId('step-1-content')).getByTestId('volume-size')).toBeTruthy());
    await waitFor(() => expect(view.getByTestId('volume-size-projectSetting-content').textContent).toContain(`${defaultVolumeSizeGiB}GiB`));
    await waitFor(() => expect(view.getByTestId('volume-size-recommendedSetting-content').textContent).toContain(`${recommendedVolumeSizeGiB}GiB`));
  });

  it('should not display volume size selector in the first step when the EnableDiskUsageVolumeCheck FF is off', async () => {
    // This removes principal from global store such that the principal API fetches again on component mount
    GlobalStore.removeItem(storageKeys.principal);
    mocks.api.auth.getPrincipal.mockResolvedValue({
      featureFlags: [
        'ShortLived.FastStartDataSets',
        'ShortLived.MultipleComputeClustersEnabled',
        'ShortLived.EnableEnvironmentRevisions',
      ],
      booleanSettings: []
    });
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...defaultJobsLauncherViewProps}
          />
        </AccessControlProvider>
      </Router>
    );
    const voulmeSizeSelector = within(view.getByDominoTestId('step-1-content')).queryByTestId('volume-size');
    await waitFor(() => expect(voulmeSizeSelector).toBeNull());
  });

  it(`should disable 'Start' button and show inline error when 'File Name or Command' is empty`, async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['commandToRun'], defaultJobsLauncherViewProps)}
            isCommandToRunTouched={true}
          />
        </AccessControlProvider>
      </Router>
    );
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement;
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('step-1-content').textContent).toContain(MISSING_FILE_OR_COMMAND_MESSAGE));
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('step-2-change').hasAttribute('disabled')));
  });

  it(`should disable 'Start' button when environmentId is NOT available`, async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['environmentId'], defaultJobsLauncherViewProps)}
          />
        </AccessControlProvider>
      </Router>
    );
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Next);
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('step-2-change').hasAttribute('disabled')));
  });

  it(`should disable 'Start' button when hardwareTierId is NOT available`, async () => {
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['hardwareTierId'], defaultJobsLauncherViewProps)}
          />
        </AccessControlProvider>
      </Router>
    );
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Next);
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('step-2-change').hasAttribute('disabled')));
  });

  it(`should call handleSubmit on starting the job, which calls the startJob API`, async () => {
    const handleSubmit = jest.fn().mockImplementation(() => Promise.resolve());
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['handleSubmit'], defaultJobsLauncherViewProps)}
            handleSubmit={handleSubmit}
          />
        </AccessControlProvider>
      </Router>
    );
    await waitFor(() => expect(view.getByText('test-clone-clone-clone')).toBeTruthy());
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Next);
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('step-2-change').hasAttribute('disabled')).toBeFalsy());
    const startButton = view.getByDominoTestId('step-2-change');
    fullClick(startButton);
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
  });

  it(`should call handleSubmit on starting the job when it is a Git Based Project, which calls the startJob API`, async () => {
    const handleSubmit = jest.fn().mockImplementation(() => Promise.resolve());
    const onCommandToRunChangeMock = jest.fn();
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['handleSubmit', 'isGitBasedProject', 'onCommandtoRunChange'], defaultJobsLauncherViewProps)}
            handleSubmit={handleSubmit}
            onCommandToRunChange={onCommandToRunChangeMock}
            isGitBasedProject={true}
            gitReferenceDetails={{ defaultRef: 'head' }}
          />
        </AccessControlProvider>
      </Router>
    );
    const textInput = view.getByDominoTestId('command-to-run-gbp');
    await userEvent.type(textInput, 'main.py');
    await waitFor(() => expect(onCommandToRunChangeMock).toBeCalledWith('main.py'));
    await waitFor(() => expect(view.getByDominoTestId('command-to-run-gbp').getAttribute('value')).toEqual('main.py'));
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('step-2-change').hasAttribute('disabled')).toBeFalsy());
    const startButton = view.getByDominoTestId('step-2-change');
    fullClick(startButton);
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
  });

  it(`should call handleSubmit on starting the job when it is a Git Based Project
  and when the branch is specified, which calls the startJob API`, async () => {
    const handleSubmit = jest.fn().mockImplementation(() => Promise.resolve());
    const onCommandToRunChangeMock = jest.fn();
    const onGitRefChangeMock = jest.fn();
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['handleSubmit', 'isGitBasedProject', 'onCommandToRunChange', 'onGitRefChange'], defaultJobsLauncherViewProps)}
            handleSubmit={handleSubmit}
            onCommandToRunChange={onCommandToRunChangeMock}
            onGitRefChange={onGitRefChangeMock}
            isGitBasedProject={true}
            gitReferenceDetails={{ defaultRef: 'head' }}
          />
        </AccessControlProvider>
      </Router>
    );
    const gitRefSelector = view.getByDominoTestId('defaultref-field').querySelector('input')!;
    fullClick(gitRefSelector);
    // `userEvent` API can't be used for Select component's option selection, as this is a documented
    // [bug](https://github.com/ant-design/ant-design/issues/31105) in antd. Using `fireEvent` API instead.
    fullClick(view.getByText('Branches'));
    await waitFor(() => expect(onGitRefChangeMock).toHaveBeenCalledWith({ defaultRef: 'branches', refDetails: undefined }));
    const gitRefInput = view.getByDominoTestId('refdetails-field');
    await userEvent.type(gitRefInput, 'main');
    await waitFor(() => expect(onGitRefChangeMock).toHaveBeenCalledWith({ defaultRef: 'branches', refDetails: 'main' }));
    const textInput = view.getByDominoTestId('command-to-run-gbp');
    await userEvent.type(textInput, 'main.py');
    await waitFor(() => expect(onCommandToRunChangeMock).toBeCalledWith('main.py'));
    await waitFor(() => expect(view.getByDominoTestId('command-to-run-gbp').getAttribute('value')).toEqual('main.py'));
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('step-2-change').hasAttribute('disabled')).toBeFalsy());
    const startButton = view.getByDominoTestId('step-2-change');
    fullClick(startButton);
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
  }, 10000);

  it(`should show save snapshot option in data step when 'allowDatasetSnapshotsOnExecutionCompletion' FF is set`, async () => {
    const handleSubmit = jest.fn().mockImplementation(() => Promise.resolve());
    const onCommandToRunChangeMock = jest.fn();
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['handleSubmit', 'isGitBasedProject', 'onCommandtoRunChange'], defaultJobsLauncherViewProps)}
            handleSubmit={handleSubmit}
            onCommandToRunChange={onCommandToRunChangeMock}
            isGitBasedProject={true}
            gitReferenceDetails={{ defaultRef: 'head' }}
            allowDatasetSnapshotsOnExecutionCompletion={true}
          />
        </AccessControlProvider>
      </Router>
    );
    const textInput = view.getByDominoTestId('command-to-run-gbp');
    await userEvent.type(textInput, 'main.py');
    await waitFor(() => expect(onCommandToRunChangeMock).toBeCalledWith('main.py'));
    await waitFor(() => expect(view.getByDominoTestId('command-to-run-gbp').getAttribute('value')).toEqual('main.py'));
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('save-dataset-snapshots')).toBeTruthy());
  });

  it(`should call set function when checkbox is checked or unchecked`, async () => {
    const handleSubmit = jest.fn().mockImplementation(() => Promise.resolve());
    const onCommandToRunChangeMock = jest.fn();
    const onSaveSnapshotCheckboxChangeMock = jest.fn();
    const view = render(
      <Router>
        <AccessControlProvider>
          <JobsLauncherView
            {...R.omit(['handleSubmit', 'isGitBasedProject', 'onCommandtoRunChange'], defaultJobsLauncherViewProps)}
            handleSubmit={handleSubmit}
            onCommandToRunChange={onCommandToRunChangeMock}
            isGitBasedProject={true}
            gitReferenceDetails={{ defaultRef: 'head' }}
            allowDatasetSnapshotsOnExecutionCompletion={true}
            saveSnapshot={false}
            setSaveSnapshot={onSaveSnapshotCheckboxChangeMock}
          />
        </AccessControlProvider>
      </Router>
    );
    const textInput = view.getByDominoTestId('command-to-run-gbp');
    await userEvent.type(textInput, 'main.py');
    await waitFor(() => expect(onCommandToRunChangeMock).toBeCalledWith('main.py'));
    await waitFor(() => expect(view.getByDominoTestId('command-to-run-gbp').getAttribute('value')).toEqual('main.py'));
    const step3Next = view.getByDominoTestId('step-3-jump').firstElementChild as HTMLElement
    fullClick(step3Next);
    await waitFor(() => expect(view.getByDominoTestId('save-dataset-snapshots')).toBeTruthy());
    const saveSnapshotsCheckbox = view.getByDominoTestId('save-dataset-snapshots').querySelector('input[type="checkbox"]') as HTMLInputElement;
    await userEvent.click(saveSnapshotsCheckbox);
    await waitFor(() => expect(onSaveSnapshotCheckboxChangeMock).toBeCalledWith(true));
  });
});
