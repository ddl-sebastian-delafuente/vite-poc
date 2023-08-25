import * as React from 'react';
import { MemoryRouter as Router } from 'react-router';
import 'jest-styled-components';
import { within } from '@testing-library/react';
import { fireEvent, render, waitFor, screen } from '@domino/test-utils/dist/testing-library';
import * as R from 'ramda';
import * as Projects from '@domino/api/dist/Projects';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import { DominoEnvironmentsApiEnvironmentDetails, DominoNucleusProjectProjectSettingsDto } from '@domino/api/dist/types';
import {
  transformResultsToDataSource,
  getOptions,
  optionTitle,
  findGroupOptions,
} from '../ComputeEnvironmentSelector';
import ComputeEnvironmentDropdown, {
  findEnvInComputeData,
  getEnvironments,
} from '../ComputeEnvironmentDropdown';
import { testResults, curatedEnvironments, restrictedEnvironments } from './computeEnvironmentData';
import { EnvronmentRevisionSpec } from '@domino/test-utils/dist/mocks';

const selectedEnvironment = testResults[2];

const mockEnvironments = {
  currentlySelectedEnvironment: {
    id: '5e981b92c3427a28af9c9dd2',
    supportedClusters: [],
    v2EnvironmentDetails:{
      latestRevision: 16,
      latestRevisionStatus: 'Failed',
      latestRevisionUrl: '/environments/revisions/5e9829ef23236574390f84ba',
      selectedRevision: 15,
      selectedRevisionUrl: '/environments/revisions/5e981e23c3427a28af9c9e32'
    }
  },
  environments: testResults
};

const mockRevisionsInfo = {
  revisions: [
    {id: '61a73748d04758372110231e', number: 3, created: 1638348616973},
    {id: 'test-revision-id', number: 2, created: 1638175949915},
    {id: '61a46956f04e9e5137a593b5', number: 1, created: 1638164821975}],
  pageInfo: {
    totalPages: 0,
    currentPage: 0,
    pageSize: 20
  }
};

const mockEnvironment: DominoEnvironmentsApiEnvironmentDetails = {
  id: '61a46955f04e9e5137a593b1',
  archived: false,
  name: 'Domino Standard Environment Py3.8 R4.1',
  visibility: 'Global',
  supportedClusters: [],
  latestRevision: {
    id: '61a73748d04758372110231e',
    number: 3,
    status: 'Succeeded',
    url: '/environments/revisions/61a73748d04758372110231e',
    isRestricted: false,
    availableTools:[{
      id: 'jupyter',
      name: 'jupyter',
      title: 'Jupyter (Python, R, Julia)',
      iconUrl: '/assets/images/workspace-logos/Jupyter.svg',
      start:['/opt/domino/workspaces/jupyter/start'],
  }]},
  selectedRevision: {
    id: '61a73748d04758372110231e',
    number: 3,
    status: 'Succeeded',
    url: '/environments/revisions/61a73748d04758372110231e',
    isRestricted: false,
    availableTools:[{
      id: 'jupyter',
      name: 'jupyter',
      title: 'Jupyter (Python, R, Julia)',
      iconUrl: '/assets/images/workspace-logos/Jupyter.svg',
      start:['/opt/domino/workspaces/jupyter/start'],
  }]}
};

const mockProjectSettings : DominoNucleusProjectProjectSettingsDto = {
  defaultEnvironmentId: 'dEId',
  defaultHardwareTierId: 'dHTId',
  defaultVolumeSizeGiB: 0,
  maxVolumeSizeGiB: 2,
  minVolumeSizeGiB: 0,
  sparkClusterMode: 'Local',
  defaultEnvironmentRevisionSpec: EnvronmentRevisionSpec.LatestRevision,
  recommendedVolumeSizeGiB: 1,
}

jest.mock('@domino/api/dist/Environments', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBuiltEnvironmentRevisions: (_args: { environmentId: string, page: number, pageSize: number }) =>
    Promise.resolve(mockRevisionsInfo),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getEnvironmentById: (_args: {environmentId: string }) => Promise.resolve(mockEnvironment)
}));
jest.mock('@domino/api/dist/Projects');

afterAll(() => {
  jest.unmock('@domino/api/dist/Environments');
});
afterEach(() => {
  jest.unmock('@domino/api/dist/Projects');
})

const mockGetUseableEnvironments = () => {
  const getUseableEnvironments = jest.spyOn(Projects, 'getUseableEnvironments');
  getUseableEnvironments.mockImplementation(async () => mockEnvironments);
};

describe('Compute Environment', () => {

  const getProjectSettings = jest.spyOn(Projects, 'getProjectSettings');
  getProjectSettings.mockImplementation(async () => (mockProjectSettings));

  it('Formats the input data', () => {
    const data = transformResultsToDataSource(testResults);
    expect(Object.keys(data)).toContain('Private');
    expect(Object.keys(data)).toContain('Global');
    expect(Object.keys(data)).toContain('Organization');
  });

  it('Finds environment in compute data with no result', () => {
    const searchResEmpty = findEnvInComputeData(testResults)('NO_VALID_KEY');
    expect(searchResEmpty).toBe(undefined);
    const searchResEmpty2 = findEnvInComputeData([])('NO_VALID_KEY');
    expect(searchResEmpty2).toBe(undefined);
    const searchResEmpty3 = findEnvInComputeData(undefined as any)(undefined as any);
    expect(searchResEmpty3).toBe(undefined);
  });

  it('Finds environment in compute data with result', () => {
    const searchRes = findEnvInComputeData(testResults)(selectedEnvironment.id);
    if (searchRes) {
      expect(searchRes.id).toEqual(selectedEnvironment.id);
    } else {
      throw Error('Search res empty!')
    }
  });

  it('Sets the option title', () => {
    const firstExpectedChildTitle = optionTitle(testResults[1]);
    expect(firstExpectedChildTitle).toEqual('2 (Default) *');

    const secondExpectedChildTitle = optionTitle(testResults[2]);
    expect(secondExpectedChildTitle).toEqual('3 Dash app publishing');

    const thirdExpectedChildTitle = optionTitle(testResults[3]);
    expect(thirdExpectedChildTitle).toEqual('4 xyz * (archived)');
  });

  it('Renders options with group', () => {
    const testTitle = 'Test Title';
    const testOptions = getOptions(testTitle, testResults);
    expect(testOptions.label.props.children).toEqual(testTitle);
    expect(testOptions.options.length).toEqual(testResults.length);

    const firstChildResult = testOptions.options[0];
    const firstExpectedChild = testResults[0];
    const firstExpectedChildTitle = optionTitle(testResults[0]);

    expect(firstChildResult.value).toEqual(firstExpectedChild.id);
    expect(firstChildResult['data-group-title']).toEqual(testTitle);
    expect(firstChildResult['data-title']).toEqual(firstExpectedChildTitle);
  });

  it('Show all environments without filtering for any cluster when clusterType is not passed in props', async () => {
    mockGetUseableEnvironments();
    const projectId = 'testProjectId';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testErrFn = (_error: boolean) => undefined;
    const genericEnvironments = await getEnvironments(projectId, testErrFn);
    const nonSparkEnvironments = R.filter((env) => !R.contains(ComputeClusterLabels.Spark, env.supportedClusters),
      mockEnvironments.environments);
    expect(genericEnvironments!.environments).toEqual(nonSparkEnvironments);
  });

  it('Filter the cluster specific environments when clusterType is passed in props', async () => {
    mockGetUseableEnvironments();
    const projectId = 'testProjectId';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testErrFn = (_error: boolean) => undefined;
    const clusterEnvironments = R.filter((env) => R.contains(ComputeClusterLabels.Spark, env.supportedClusters),
      mockEnvironments.environments);
    const genericEnvironments =
      await getEnvironments(projectId, testErrFn, ComputeClusterLabels.Spark, clusterEnvironments);
    expect(genericEnvironments!.environments).toEqual(clusterEnvironments);
  });

  it('Should render less than or equal to 10 DOM elements even if options are 59', async () => {
    const getUseableEnvironments = jest.spyOn(Projects, 'getUseableEnvironments');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUseableEnvironments.mockImplementation((_: any) => Promise.resolve(mockEnvironments));
    const view = render(
      <Router>
        <ComputeEnvironmentDropdown
          getContainer={jest.fn()}
          projectId={'projectId'}
          updateProjectEnvironmentOnSelect={false}
          onChangeEnvironment={jest.fn()}
          canEditEnvironments={false}
          canSelectEnvironment={true}
          shouldEnvironmentBeInSyncWithProject={false}
          environmentId={'5e981b92c3427a28af9c9dd2'}
          isControlled={true}
          projectEnvironments={mockEnvironments}
          clusterEnvironments={mockEnvironments.environments}
          areProjectEnvironmentsFetching={false}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByText('5e981b92c3427a28af9c9dd2')).toBeTruthy());
    await waitFor(() => expect(view.container.querySelector('input.ant-select-selection-search-input')).toBeTruthy());
    fireEvent.mouseDown(view.getByDominoTestId('compute-environment-dropdown').firstChild!);
    await waitFor(() => expect(view.container.querySelectorAll('div.ant-select-item-option-grouped')!.length).toBeLessThanOrEqual(10));
  });

  it('should render compute environment dropdown items based on filtering', async () => {
    const getUseableEnvironments = jest.spyOn(Projects, 'getUseableEnvironments');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUseableEnvironments.mockImplementation((_: any) => Promise.resolve(mockEnvironments));
    const view = render(
      <Router>
        <ComputeEnvironmentDropdown
          getContainer={jest.fn()}
          projectId={'projectId'}
          updateProjectEnvironmentOnSelect={false}
          onChangeEnvironment={jest.fn()}
          canEditEnvironments={false}
          canSelectEnvironment={true}
          shouldEnvironmentBeInSyncWithProject={false}
          environmentId={'5e981b92c3427a28af9c9dd2'}
          isControlled={true}
          projectEnvironments={mockEnvironments}
          clusterEnvironments={mockEnvironments.environments}
          areProjectEnvironmentsFetching={false}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByText('5e981b92c3427a28af9c9dd2')).toBeTruthy());
    await waitFor(() => expect(view.container.querySelector('input.ant-select-selection-search-input')).toBeTruthy());
    fireEvent.mouseDown(view.getByDominoTestId('compute-environment-dropdown').firstChild!);
    const searchField = view.container.querySelector('input.ant-select-selection-search-input');
    fireEvent.change(searchField!, { target: { value: 'domino' } });
    const optionItems = view.container.querySelectorAll('div.ant-select-item-option-grouped');
    optionItems!.forEach(optionItem => expect(optionItem!.textContent!.toLowerCase()).toContain('domino'));
    fireEvent.mouseDown(view.getByDominoTestId('compute-environment-dropdown').firstChild!);
    fireEvent.change(searchField!, { target: { value: 'spark' } });
    await waitFor(() => expect(view.getByRole('listbox').textContent!.toLowerCase()).not.toContain('spark'));
    await waitFor(() => expect(view.container.querySelector('div.ant-empty-image')!).toBeTruthy());
    await waitFor(() => expect(view.getByRole('listbox').textContent!.toLowerCase()).toContain('no data'));
  });

  it('should group options properly when curated environments exist', () => {
    const environments = [...curatedEnvironments, ...testResults];
    const options = findGroupOptions(environments);

    const curatedOptions = options[0];
    const globalOptions = options[1];
    const privateOptions = options[options.length - 1];
    const orgOptions = options.slice(2, options.length - 1);

    expect(curatedOptions['search-value']).toEqual('Curated');
    expect(globalOptions['search-value']).toEqual('Global');
    expect(privateOptions['search-value']).toEqual('Private');
    expect(orgOptions.map(o => o['search-value']).sort()).toEqual(['AbcOrg', 'chriscoolorg', 'test_org'].sort());
  });

  it('should not include a curated group when no curated environments exist', () => {
    const options = findGroupOptions(mockEnvironments.environments);

    const globalOptions = options[0];
    const privateOptions = options[options.length - 1];
    const orgOptions = options.slice(1, options.length - 1);

    expect(globalOptions['search-value']).toEqual('Global');
    expect(privateOptions['search-value']).toEqual('Private');
    expect(orgOptions.map(o => o['search-value']).sort()).toEqual(['AbcOrg', 'chriscoolorg', 'test_org'].sort());
  });

  it('Should show restricted info and restricted revision numbers in the dropdown', async () => {
    const getUseableEnvironments = jest.spyOn(Projects, 'getUseableEnvironments');
    const restrictedMockEnvironments = R.mergeDeepRight(mockEnvironments, {environments: restrictedEnvironments});
    getUseableEnvironments.mockImplementation(() => Promise.resolve(restrictedMockEnvironments));
    const view = render(
      <Router>
        <ComputeEnvironmentDropdown
          getContainer={jest.fn()}
          projectId={'projectId'}
          updateProjectEnvironmentOnSelect={false}
          onChangeEnvironment={jest.fn()}
          canEditEnvironments={false}
          canSelectEnvironment={true}
          shouldEnvironmentBeInSyncWithProject={false}
          environmentId={'5e981b92c3427a28af9c9dd2'}
          isControlled={true}
          projectEnvironments={restrictedMockEnvironments}
          clusterEnvironments={restrictedMockEnvironments.environments}
          areProjectEnvironmentsFetching={false}
          isRestrictedProject={true}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByText('5e981b92c3427a28af9c9dd2')).toBeTruthy());
    fireEvent.mouseDown(screen.getByRole('combobox'));
    await waitFor(() => expect(view.queryByText('This project can only use “Restricted” environment revisions.')).toBeTruthy());
    const option = view.getByDominoTestId('c-1');
    await waitFor(() => expect(within(option).getByText('Rev #4')).toBeTruthy());
  });
});
