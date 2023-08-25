import * as React from 'react';
import 'jest-styled-components';
import { MemoryRouter as Router } from 'react-router';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import * as Projects from '@domino/api/dist/Projects';
import * as Auth from '@domino/api/dist/Auth';
import * as Users from '@domino/api/dist/Users';
import * as Files from '@domino/api/dist/Files';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import RunJobButton from '../RunJobButton';
import { principal, project } from '../../utils/testUtil';
import { environmentDetails, projectSettingsDto, user } from '@domino/test-utils/dist/mocks';

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.track = jest.fn()

const getUseableEnvironmentsSelectedNotOnDemandSpark = {
  ...environmentDetails,
  'currentlySelectedEnvironment': {
    'id': '5e1777a02d7e787f46eec3b1',
    'v2EnvironmentDetails': {
      'latestRevision': 1,
      'latestRevisionUrl': '/environments/revisions/5e1777a02d7e787f46eec3b3',
      'latestRevisionStatus': 'Succeeded',
      'selectedRevision': 1,
      'selectedRevisionUrl': '/environments/revisions/5e1777a02d7e787f46eec3b3'
    },
    'supportedClusters': []
  },
  'environments': [
    {
      'id': '5e1777a02d7e787f46eec3b1',
      'archived': false,
      'name': 'privateenv',
      'version': 2,
      'visibility': 'Private',
      'owner': {
        'id': '5e176e10951fedfa62fef058',
        'username': 'integration-test'
      },
      'supportedClusters': []
    },
    {
      'id': '5e1e526b1057e56695a4c277',
      'archived': false,
      'name': 'dddd',
      'version': 2,
      'visibility': 'Private',
      'owner': {
        'id': '5e176e10951fedfa62fef058',
        'username': 'integration-test'
      },
      'supportedClusters': []
    },
    {
      'id': '5e1fa652d83bf838fc75cf47',
      'archived': false,
      'name': 'spark8',
      'version': 2,
      'visibility': 'Private',
      'owner': {
        'id': '5e176e10951fedfa62fef058',
        'username': 'integration-test'
      },
      'supportedClusters': [ComputeClusterLabels.Spark]
    },
    {
      'id': '5e1fb25e0f4ad90d7967c4cf',
      'archived': false,
      'name': 'spark9',
      'version': 2,
      'visibility': 'Private',
      'owner': {
        'id': '5e176e10951fedfa62fef058',
        'username': 'integration-test'
      },
      'supportedClusters': []
    },
    {
      'id': '5e1fb29a0f4ad90d7967c4d4',
      'archived': false,
      'name': 'custom image',
      'version': 2,
      'visibility': 'Private',
      'owner': {
        'id': '5e176e10951fedfa62fef058',
        'username': 'integration-test'
      },
      'supportedClusters': []
    },
    {
      'id': '5e0e85a1b9333e7c0501e497',
      'archived': false,
      'name': 'Default',
      'version': 2,
      'visibility': 'Global',
      'supportedClusters': []
    },
    {
      'id': '5e17773d2d7e787f46eec3aa',
      'archived': false,
      'name': 'A global',
      'version': 2,
      'visibility': 'Global',
      'supportedClusters': []
    }
  ]
};

const fileSearchMock = { projectId: 'projectId', commitId: 'commitId', files: ['file1'] };
const getUseableEnvironmentMock = {
  currentlySelectedEnvironment: {
    id: 'id',
    supportedClusters: [ComputeClusterLabels.Spark],
  },
  environments: [],
};
const getProjectSettingsMock = {
  ...projectSettingsDto,
  defaultEnvironmentId: 'defaultEnvironmentId',
  defaultHardwareTierId: 'defaultHardwareTierId',
  sparkClusterMode: 'Local',
} as const;

let getPrincipal: jest.SpyInstance;
let getCurrentUser: jest.SpyInstance;
let fileSearch: jest.SpyInstance;
let getUseableEnvironments: jest.SpyInstance;
let getUseableEnvironmentDetails: jest.SpyInstance;
let getProjectSettings: jest.SpyInstance;
let listHardwareTiersForProject: jest.SpyInstance;
let mocks: Array<jest.SpyInstance>;

beforeAll(() => {
  getPrincipal = jest.spyOn(Auth, 'getPrincipal').mockResolvedValue(principal);
  getCurrentUser = jest.spyOn(Users, 'getCurrentUser').mockResolvedValue(user);
  fileSearch = jest.spyOn(Files, 'fileSearch').mockResolvedValue(fileSearchMock);
  getUseableEnvironments = jest.spyOn(Projects, 'getUseableEnvironments').mockResolvedValue(getUseableEnvironmentMock);
  getUseableEnvironmentDetails = jest.spyOn(Projects, 'getUseableEnvironmentDetails').mockResolvedValue(getUseableEnvironmentsSelectedNotOnDemandSpark);
  getProjectSettings = jest.spyOn(Projects, 'getProjectSettings').mockResolvedValue(getProjectSettingsMock);
  listHardwareTiersForProject = jest.spyOn(Projects, 'listHardwareTiersForProject').mockResolvedValue([]);

  mocks = [
    getPrincipal,
    getCurrentUser,
    fileSearch,
    getUseableEnvironments,
    getUseableEnvironmentDetails,
    getProjectSettings,
    listHardwareTiersForProject
  ];
});

afterAll(() => {
  unmockMocks(mocks);
  jest.resetModules();
});

describe('RunJobButton', () => {
  const defaultProps = {
    handleSubmit: jest.fn(),
    handleCancel: jest.fn(),
    withJobsDashboardRouting: false,
    projectId: 'projectId',
    visible: true,
    previousValuesStorageKey: '',
    project: project,
    areMultipleClustersEnabled: false,
    hasGitCredentials: true
  };

  it(`should render 'RunJobButton'`, () => {
    const { getAllByDominoTestId } = render(<RunJobButton {...defaultProps} />, { wrapper: Router });
    expect(getAllByDominoTestId('jobs-launcher').length).toBeGreaterThan(0);
  });

  it(`should render the Modal with [className="jobs-launcher"]`, () => {
    const { getAllByRole } = render(<RunJobButton {...defaultProps} />, { wrapper: Router });
    const [jobsLauncherModal] = getAllByRole('dialog');
    const jobsLauncherModalClasses = jobsLauncherModal.getAttribute('class');
    expect(jobsLauncherModalClasses).toContain('ant-modal');
    expect(jobsLauncherModalClasses).toContain('jobs-launcher');
  });

  it(`should call 'handleCancel' on closing the modal`, async () => {
    const handleCancel = jest.fn();
    const { getByDominoTestId } = render(<RunJobButton {...defaultProps} handleCancel={handleCancel} />, { wrapper: Router });
    await userEvent.click(getByDominoTestId('step-0-cancel'));
    await waitFor(() => expect(handleCancel).toHaveBeenCalledTimes(1));
  });
});
