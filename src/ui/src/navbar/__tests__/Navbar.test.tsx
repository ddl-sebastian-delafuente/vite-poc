import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoWorkspaceApiWorkspaceDto as Workspace
} from '@domino/api/dist/types';
import * as Jobs from '@domino/api/dist/Jobs';
import * as Users from '@domino/api/dist/Users';
import { AccessControlProvider } from '@domino/ui/dist/core/AccessControlProvider';
import NavBar from '../Navbar';
import { workspaceDashboardBase } from '../../core/routes';
import { testResults } from '../../components/__tests__/computeEnvironmentData';

const mockEnvironments = {
  currentlySelectedEnvironment: {
    id: "5e981b92c3427a28af9c9dd2",
    supportedClusters: [],
    v2EnvironmentDetails:{
      latestRevision: 16,
      latestRevisionStatus: "Failed",
      latestRevisionUrl: "/environments/revisions/5e9829ef23236574390f84ba",
      selectedRevision: 15,
      selectedRevisionUrl: "/environments/revisions/5e981e23c3427a28af9c9e32"
    }
  },
  environments: testResults
};

const project: Project = {
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
    'UpdateProjectDescription',
    'ViewWorkspaces'
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

const mockUser = {
  avatarUrl: "",
  email: "integration-test@dominoup.com",
  firstName: "John",
  fullName: "John Doe",
  id: "5eafdf89ee38bb0aff842fa5",
  lastName: "Doe",
  userName: "integration-test"
}

const mockWorkspace = {
  'id': '5f44ee5f172fdf43f700b0a4',
  'deleted': false,
  'projectId': '5f3c1afe91c2b54ae7064fff',
  'ownerId': '5f3c1afea8512c58ef860448',
  'ownerName': 'Owner name',
  'name': 'Jupyter (Python, R, Julia) session',
  'state': 'Started',
  'stateUpdatedAt': '0',
  'initConfig': {
    'volumeSize': { value: 100, unit: 'GiB' }
  },
  'configTemplate': {
    'environment': {
      'id': '5f365bf8c981e722bd2a1aa1',
      'name': 'Default',
      'revisionId': '5f365bf8c981e722bd2a1aa1',
      'revisionNumber': 1,
      'revisionType': 'Latest',
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
  'createdAt': '0',
  'sessionStats': {
    'runTimeSec': 0
  },
  'mostRecentSession': {
    'id': '5f5a090dd97fb54c531c3cb1',
    'executionId': '5f5a090dd97fb54c531c3cb2',
    'config': {
      'environment': {
        'id': '5f5a090dd97fb54c531c3cb3',
        'name': 'test-env',
        'revisionId': '5f365bf8c981e722bd2a1aa1',
        'revisionNumber': 1,
        'revisionType': 'Latest',
        isRestricted: false,
      },
      'hardwareTier': {
        'id': {
          'value': 'blah'
        },
        'name': 'test-hwtier'
      },
      'tools': ['Jupyter'],
      'clusterProps': {
        'computeEnvironment': {
          'id': '5f5a090dd97fb54c531c3cb4',
          'name': 'compute-env',
          'revisionId': 'f5a090dd97fb54c531c3cb4',
          'revisionNumber': 1,
          'revisionType': 'Latest',
          isRestricted: false,
        },
        'executorCount': 1,
        'executorHardwareTierId': {
          'value': 'blah'
        },
        'volumeSize': { value: 100, unit: 'GiB' },
        'masterHardwareTierId':  {
          'value': 'blah'
        }
      },
    },
    'datasetConfig': {
      'name': 'blah',
      'resolutionCommit': 'bf9dfc44a68b152ce2c30ba3376adf8d112bb0e1'
    },
    'datasetMounts': [
      {
        'datasetId': '5f5a090dd97fb54c531c3cb6',
        'snapshot': {
          'snapshotId': '5f5a090dd97fb54c531c3cb7',
          'snapshotVersion': 1
        },
        'datasetName': 'test-dataset',
        'containerPath': '/',
        'isInput': true
      }
    ],
    'start': {
      'time': 1599736077348
    },
    'end': {
      'time': 1599736077348,
      'exitStatus': 'Succeeded',
      'repoDirty': false
    },
    'sessionStatusInfo': {
      'rawExecutionDisplayStatus': 'Running',
      'rawExecutionDisplayStatusUpdatedAt': '2020-03-05T07:18:48.654Z',
      'isLoading': false,
      'isRunning': true,
      'isStoppable': true,
      'isCompleting': false,
      'isFailed': false,
      'isSuccessful': false,
      'isCompleted': false
    },
    'externalVolumeMounts': [],
    'queuedWorkspaceHistoryDetails': {
      'expectedWait': 'now',
      'explanation': 'Your workspace has been deployed to default.',
      'helpText': 'It will start being prepared for execution momentarily.'
    },
  },
  'isLegacy': false,
  'importedProjects': [],
  'importedGitRepos': [],
  'dataPlaneId': '5f5a090dd97fb54c531c3cb8',
  'isReproduced': false,

} as Workspace;

jest.mock('@domino/api/dist/Workspace', () => ({
  ownerProvisionedWorkspaces: () => Promise.resolve({
    workspaces: [mockWorkspace],
    totalWorkspaceCount: 6,
    offset: 0,
    limit: 5,
  })
}));

jest.mock('@domino/api/dist/Projects', () => ({
  getUseableEnvironments: () =>
    Promise.resolve(mockEnvironments)
}));

let isDataAnalystUser: jest.SpyInstance;
let getCurrentUser: jest.SpyInstance;

const mockCurrentUserApi = () => {
  getCurrentUser = jest.spyOn(Users, 'getCurrentUser');
  getCurrentUser.mockImplementation(async () => mockUser);

  isDataAnalystUser = jest.spyOn(Users, 'isDataAnalystUser').mockResolvedValue(false);
};

beforeEach(() => {
  mockCurrentUserApi();
});

afterAll(() => {
  jest.unmock('@domino/api/dist/Workspace');
  jest.unmock('@domino/api/dist/Projects');

  getCurrentUser.mockRestore();
  isDataAnalystUser.mockRestore();
});

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.track = jest.fn();
// @ts-ignore
global.mixpanel.track_links = jest.fn()
// @ts-ignore
global.mixpanel.register = jest.fn()

describe('<Navbar />', () => {
  const defaultProps = {
    isNucleusApp: true,
    project,
    updateProject: () => undefined,
    projectStages: [],
    username: 'integration-test',
    userId: 'userId',
    loading: false,
    flags: {
      showEndpointSpend: true,
      showComputeInControlCenter: true,
      showTagsNavItem: true,
      showAdminMenu: true,
      showDSLFeatures: true,
      enableSparkClusters: true,
      enableRayClusters: true,
      enableDaskClusters: false
    },
    user: {
      id: 'peterParkerId',
      userName: 'spidy',
      firstName: 'Peter',
      lastName: 'Parker',
      fullName: 'Peter Benjamin Parker',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider-Man_Vol_1_129-1.png',
      isAnonymous: false
    },
    setGlobalSocket: (socket: SocketIOClient.Socket) => socket,
    dmmLink: undefined,
  };

  const getTagsInProject = jest.spyOn(Jobs, 'getTagsInProject');
  getTagsInProject.mockImplementation(async () => []);

  it('should show launchers as option under publish if enable launchers true', () => {
    window.history.pushState( {}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('PUBLISH_LAUNCHERS')).not.toBe(undefined);
  });

  it('should show launchers as option under publish if enable launchers false', () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={{
              ...defaultProps.flags,
              enableLaunchers: false,
            }}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('PUBLISH_LAUNCHERS')).not.toBe(undefined);
  });

  it('should show workspaces item for restartable workspaces', () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={defaultProps.flags}
          />
        </Router>
      </AccessControlProvider>
    );
    const workspaceMenuItems = view.getAllByDominoTestId('WORKSPACES');
    workspaceMenuItems.forEach(menu => {
      expect(menu.querySelector('a')?.getAttribute('href')).toEqual(workspaceDashboardBase(project.owner.userName, project.name));
    });
    expect(view.getAllByDominoTestId('WORKSPACES')).toBeTruthy();
  });

  it('should show code & artifacts for a git first project', () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...{...defaultProps, project: {...project, mainRepository: {uri: 'http://repo.git'}}}}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('CODE')[0].textContent).toMatch('Code');
    expect(view.getAllByDominoTestId('FILES')[0].textContent).toMatch('Artifacts');
  });

  it('should show code for a classic project', () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('FILES')[0].textContent).toMatch('Code');
  });

  it(`should not show any icon after workspaces label when restartable workspaces is enabled and
    no restartable workspaces created in the project`, async () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={defaultProps.flags}
          />
        </Router>
      </AccessControlProvider>
    );
    await waitFor(() => expect(view.queryByDominoTestId('restartableWorkspacesListIcon')).toBeFalsy());
  });

  xit('should show `>` icon for Quick launching a workspace when restartable workspaces is enabled', async () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={defaultProps.flags}
          />
        </Router>
      </AccessControlProvider>
    );
    await waitFor(() => expect(view.getAllByDominoTestId('restartableWorkspacesListIcon')).toBeTruthy());
    await waitFor(() => expect(view.getAllByDominoTestId('restartableWorkspacesListIcon')[0].getAttribute('class')).toMatch('anticon-right'));
  });

  it('should show dmm link if dmm link is defined', () => {

    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            dmmLink="http://google.com"
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getByDominoTestId('dmm')).toBeTruthy();
  });

  it('should enable model apis under publish when enableModelAPIs FF is true.', () => {
    window.history.pushState( {}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={{
              ...defaultProps.flags,
              enableModelAPIs: true,
            }}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('PUBLISH_MODELS_API')[0].getAttribute('opacity')).toBe(null);
  });

  it('should disable model apis under publish when enableModelAPIs FF is false.', () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={{
              ...defaultProps.flags,
              enableModelAPIs: false,
            }}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('PUBLISH_MODELS_API')[0].getAttribute('opacity')).toBe('0.4');
  });

  it('should enable Apps under publish if enableApps FF is true', () => {
    window.history.pushState( {}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={{
              ...defaultProps.flags,
              enableApps: true,
            }}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('PUBLISH_PUBLISHER')[0].getAttribute('opacity')).toBe(null);
  });

  it('should disable Apps under publish if enableApps FF is false', () => {
    window.history.pushState({}, '', '/u/integration-test/quick-start/browse');
    const view = render(
      <AccessControlProvider>
        <Router>
          <NavBar
            {...defaultProps}
            flags={{
              ...defaultProps.flags,
              enableApps: false,
            }}
          />
        </Router>
      </AccessControlProvider>
    );
    expect(view.getAllByDominoTestId('PUBLISH_PUBLISHER')[0].getAttribute('opacity')).toBe('0.4');
  });
});

export {
  mockWorkspace as workspace,
  project,
};
