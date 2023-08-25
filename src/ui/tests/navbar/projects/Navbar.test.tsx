import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
} from '@domino/api/dist/types';
import * as Users from '@domino/api/dist/Users';
import * as Jobs from '@domino/api/dist/Jobs';
import NavBar from '../../../src/navbar/Navbar';
import { user as mockUser } from '../../../src/utils/testUtil';

export const mockProject: Project = {
  'id': '5c335ee32fd89d166036b9d8',
  'name': 'quick-start',
  'owner': {
    'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
    'userName': 'integration-test'
  },
  'description': 'some description',
  'hardwareTierName': 'test-clone-clone',
  'hardwareTierId': 'test-clone-clone',
  'environmentName': 'Default',
  'allowedOperations': [
    'EditTags',
    'RunLauncher',
    'ViewRuns',
    'ProjectSearchPreview',
    'ChangeProjectSettings',
    'Run',
    'BrowseReadFiles',
    'Edit',
    'UpdateProjectDescription'
  ],
  'visibility': 'Public',
  'tags': [],
  'updatedAt': '2019-05-08T19:12:13Z',
  'numComments': 6,
  'runsCountByType': [
    {
      'runType': 'App',
      'count': 140
    },
    {
      'runType': 'Workspace',
      'count': 500
    },
    {
      'runType': 'Batch',
      'count': 1119
    },
  ],
  'totalRunTime': 'PT20490644.922S',
  'stageId': '5cb087f424c57c39eef25acb',
  'status': {
    'status': 'active',
    'isBlocked': false
  },
  'requestingUserRole': 'Owner'
};

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.register = jest.fn()
// @ts-ignore
global.mixpanel.track = jest.fn();
// @ts-ignore
global.mixpanel.track_links = jest.fn()

let getCurrentUser: jest.SpyInstance;
let getTagsInProject: jest.SpyInstance;
let mocks: Array<jest.SpyInstance>;

beforeAll(() => {
  getCurrentUser = jest.spyOn(Users, 'getCurrentUser').mockResolvedValue(mockUser);
  getTagsInProject = jest.spyOn(Jobs, 'getTagsInProject').mockResolvedValue([]);
  mocks = [getCurrentUser, getTagsInProject];
});
afterAll(() => unmockMocks(mocks));

describe('<Navbar />', () => {
  const defaultProps = {
    isNucleusApp: true,
    project: mockProject,
    updateProject: () => undefined,
    projectStages: [],
    username: 'integration-test',
    loading: false,
    flags: {
      enableSparkClusters: true,
      enableRayClusters: true,
      enableDaskClusters: false,
      showEndpointSpend: true,
      showComputeInControlCenter: true,
      showTagsNavItem: true,
      showAdminMenu: true,
      showDSLFeatures: true
    },
    setGlobalSocket: (socket: SocketIOClient.Socket) => socket
  };

  it('should show admin menu if flag is true', () => {
    const flags = { ...defaultProps.flags, showAdminMenu: true };
    const { getByDominoTestId } = render(<NavBar {...defaultProps} flags={flags} />);
    expect(getByDominoTestId('admin-menu-item-admin')).toBeTruthy();
  });

  it('should not show admin menu if flag is false', () => {
    const flags = { ...defaultProps.flags, showAdminMenu: false };
    const { queryByDominoTestId } = render(<NavBar {...defaultProps} flags={flags} />);
    expect(queryByDominoTestId('admin-menu-item-admin')).toBeFalsy();
  });
});
