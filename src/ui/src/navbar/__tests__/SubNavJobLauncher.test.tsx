import * as React from 'react';
import { fireEvent, within, render, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import SubNavJobLauncher from '../projects/SubNavJobLauncher';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';
import * as Jobs from '@domino/api/dist/Jobs';
import {
  project,
  mockJobData,
  mockRevisions,
  mockEnvironment,
  mockUsableEnvs,
  getUseableEnvironmentsSelectedNotOnDemandSpark,
  mockProjectSettings,
  hardwareTierData,
  fileSearchMock
} from '../../utils/testUtil';

const defaultProps = {
  project: project,
  enableGitCredentialFlowForCollaborators: false
}

const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock('@domino/ui/dist/components/toastr', () => ({
  success: (text: string) => mockToastSuccess(text),
  error: (text: string) => mockToastError(text)
}));

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

describe('SubNavJobLauncher', () => {
  it('should show success toast when job started successfully', async () => {
    jest.spyOn(Jobs, 'startJob').mockResolvedValue(mockJobData);
    const view = render(
      <SubNavJobLauncher {...defaultProps} />
    );
    await expect(view.getByDominoTestId('jobLaunchIcon'));
    await fireEvent.click(view.getByDominoTestId('jobLaunchIcon'));
    await waitFor(() => expect(view.getAllByDominoTestId('jobs-launcher')[0]).toBeTruthy());
    await userEvent.type(within(view.getByDominoTestId('command-to-run')).getByRole('combobox'), 'main.py');
    await waitFor(() => expect(view.getByText('test-clone-clone-clone')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('start-job-now'));
    await waitFor(() => expect(mockToastSuccess).toBeCalledWith('Job started successfully.'));
  });
});
