import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mergeDeepRight } from 'ramda';
import userEvent from '@testing-library/user-event';
import {
  DominoEnvironmentsApiEnvironmentWorkspaceToolDefinition as WorkspaceToolDefinition,
  DominoProjectsApiDefaultOnDemandSparkClusterPropertiesSpec as DefaultOnDemandSparkClusterPropertiesSpec,
  DominoProjectsApiEnvironmentDetails as EnvironmentDetails,
  DominoProjectsApiUseableProjectEnvironmentsDto as UseableProjectEnvironmentsDto,
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoWorkspaceApiWorkspaceDto as WorkspaceDto,
  DominoWorkspaceApiWorkspaceClusterConfigDto,
  DominoWorkspaceApiComputeClusterConfigDto as NewClusterProperties,
  DominoWorkspaceApiWorkspaceClusterConfigDto as OldClusterProperties,
  DominoEnvironmentsApiPaginatedRevisionData,
  DominoEnvironmentsApiEnvironmentDetails
} from '@domino/api/dist/types';
import * as Workspaces from '@domino/api/dist/Workspaces';
import * as  Workspace from '@domino/api/dist/Workspace';
import * as Projects from '@domino/api/dist/Projects';
import Launcher, { LaunchMode } from '../src/restartable-workspaces/Launcher';
import {
  RestartableWorkspaceLauncherInternalProps,
  RestartableWorkspaceLauncher
} from '../src/restartable-workspaces/WorkspaceLauncher';
import { TestableReduxContainer } from './util/testUtil';
import {
   environmentDetails, projectSettingsDto,
   workspaceToolDefinition,
   EnvronmentRevisionSpec
  } from '@domino/test-utils/dist/mocks';
import { projectSettings } from '@domino/ui/dist/core/routes';
import { configure, fullClick, QueryMethod, render, RenderResult, waitFor, within, fireEvent } from '@domino/test-utils/dist/testing-library';
import { hardwareTierData, mockWorkspaceTools } from '../src/utils/testUtil';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';
import { formattedPrincipalInitialState } from '../src/globalStore/util';
import GlobalStore from '../src/globalStore/GlobalStore';
import storageKeys from '../src/globalStore/storageKeys';

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.track = jest.fn()

const defaultMaxWorkerCount = 6;
export const mockProject: Project = {
  id: '5a6fd2c7e4b0e1ee4ae0bc70',
  name: 'quick-start',
  owner: {
    id: '5a6fd2c7e4b0e1ee4ae0bc6f',
    userName: 'integration-test'
  },
  description: 'some description',
  hardwareTierName: 'default',
  hardwareTierId: 'default',
  environmentName: 'Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
  allowedOperations: ['Run'],
  visibility: 'Public',
  tags: [],
  updatedAt: '2018-11-27T22:02:13.411Z',
  numComments: 9,
  runsCountByType: [],
  totalRunTime: 'PT0S',
  stageId: 'stageId',
  status: {
    status: 'active',
    isBlocked: false
  },
  requestingUserRole: 'Owner',
};

const mockSpark: DefaultOnDemandSparkClusterPropertiesSpec = {
  executorCount: 0,
  executorHardwareTierId: 'Kubernetes',
  masterHardwareTierId: 'Kubernetes',
  computeEnvironmentId: 'Py3 and Standard packages',
  maximumExecutionSlotsPerUser: 1
};
const mockUsableEnvs: UseableProjectEnvironmentsDto = {
  currentlySelectedEnvironment: {
    id: '5e7e3f67aa38525b753d5db0',
    supportedClusters: ['Spark'],
    v2EnvironmentDetails: {
      latestRevision: 4,
      latestRevisionStatus: 'Succeeded',
      latestRevisionUrl: '/environments/revisions/5f2b148dcb69cb61ad7f9e14',
      selectedRevision: 4,
      selectedRevisionUrl: '/environments/revisions/5f2b148dcb69cb61ad7f9e14',
    }
  },
  environments: [
    {
      archived: false,
      id: '5ea20818d608606d9e5d6b78',
      name: 'SAS',
      owner: { id: '5eb46d734e0e50275c975891', username: 'SAS' },
      supportedClusters: [],
      version: 2,
      visibility: 'Organization'
    },
    {
      id: '607d10ba0fec3f2ca97347ff',
      archived: false,
      name: 'Env',
      version: 2,
      visibility: 'Private',
      owner: { 'id': '5fcfbe8b4bfcffed45e745b2', 'username': 'username' },
      supportedClusters: ['Spark', 'Ray']
    }
  ]
};

const mockWorkspaceDefinitions: WorkspaceToolDefinition[] = [
  {
    ...workspaceToolDefinition,
    'id': 'jupyter',
    'iconUrl': '/assets/images/workspace-logos/Jupyter.svg',
    'name': 'jupyter',
    'title': 'Jupyter (Python, R, Julia)'
  }, {
    ...workspaceToolDefinition,
    'id': 'rstudio',
    'name': 'rstudio',
    'title': 'RStudio'
  }
];

const mockWorkspace: WorkspaceDto = {
  'id': '5f44ee5f172fdf43f700b0a4',
  'deleted': false,
  'projectId': '5f3c1afe91c2b54ae7064fff',
  'ownerId': '5f3c1afea8512c58ef860448',
  'ownerName': 'Owner name',
  'name': 'Jupyter (Python, R, Julia) session',
  'state': 'Stopped',
  'stateUpdatedAt': '2020-03-05T07:18:48.654Z',
  'createdAt': '2020-03-05T07:18:48.654Z',
  'importedProjects': [],
  'importedGitRepos': [],
  'dataPlaneId': '000000000000000000000000',
  'initConfig': {
    'volumeSize': {value: 100, unit: 'GiB'}
  },
  'configTemplate': {
    'environment': {
      'id': '5f365bf8c981e722bd2a1aa1',
      'name': 'Default',
      'revisionId': '5f5a090dd97fb54c531c3cb3',
      'revisionNumber': 1,
      'revisionType': 'Active',
      isRestricted: false,
    },
    'hardwareTier': {
      'id': {
        'value': 'test-clone'
      },
      'name': 'hardware tier name'
    },
    'tools': ['jupyter']
  },
  'sessionStats': {
    'runTimeSec': 0
  },
  'isLegacy': false,
  'isReproduced': false
};

const mockRevisions: DominoEnvironmentsApiPaginatedRevisionData = {
  revisions: [
    {id: '61a73748d04758372110231e', number: 3, created: 1638348616973},
    {id: 'test-revision-id', number: 2, created: 1638175949915},
    {id: '61a46956f04e9e5137a593b5', number: 1, created: 1638164821975}],
  pageInfo: {
    totalPages: 1,
    currentPage: 0,
    pageSize:20
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

const getUseableEnvironmentsSelectedNotOdSpark: EnvironmentDetails = {
  ...environmentDetails,
  'id': '5e1777a02d7e787f46eec3b1',
  'supportedClusters': []
};

const defaultVolumeSizeGiB = 5;
const recommendedVolumeSizeGiB = 8;

const mockProjectSettings = {
  ...projectSettingsDto,
  defaultEnvironmentId: 'dEId',
  defaultHardwareTierId: 'dHTId',
  sparkClusterMode: 'OnDemand',
  defaultVolumeSize: 0,
  defaultEnvironmentRevisionSpec: EnvronmentRevisionSpec.LatestRevision,
  defaultVolumeSizeGiB,
  recommendedVolumeSizeGiB
};

const mockProfile: MockProfile = {
  admin: {
    getWhiteLabelConfigurations: {},
  },
  auth: {
    getPrincipal: {
      isAnonymous: true,
      isAdmin: false,
      allowedSystemOperations: ['EditCentralConfig'],
      featureFlags: ['ShortLived.SparkAutoscalingEnabled', 'ShortLived.EnableDiskUsageVolumeCheck'],
      booleanSettings: [],
      mixpanelSettings: {
        frontendClientEnabled: true,
        backendClientEnabled: true,
        token: 'token',
      }
    }
  },
  environments: {
    getBuiltEnvironmentRevisions: mockRevisions,
    getEnvironmentById: mockEnvironment,
    getAvailableToolsForEnvironment: mockWorkspaceDefinitions
  },
  projects: {
    getUseableEnvironments: mockUsableEnvs,
    getUseableEnvironmentDetails: getUseableEnvironmentsSelectedNotOdSpark,
    getProjectSettings: mockProjectSettings,
    listHardwareTiersForProject: hardwareTierData
  },
  users: {
    isDataAnalystUser: false,
    getCurrentUser: {}
  },
  workspaces: {
    getDefaultOnDemandSparkSettings: mockSpark,
    getAvailableWorkspaceDefinitions: mockWorkspaceDefinitions,
    getAvailableToolsForEnvironment: mockWorkspaceTools
  },
  workspace: {
    createAndStartWorkspace: {},
    getDefaultComputeClusterSettings: {
      clusterType:"Spark",
      computeEnvironmentId:"60bf5b5b6201527187e60b69",
      computeEnvironmentRevisionSpec:{"revisionId":"60bf5b5b6201527187e60b6b"},
      masterHardwareTierId:{"value":"small-k8s-spark"},
      workerCount:1,
      workerHardwareTierId:{"value":"small-k8s-spark"},
      maxUserExecutionSlots:33
    }
  },
  datamount: {
    findDataMountsByProject: [],
    getRootPathForProject: 'rootpath',
    checkAndUpdateDataMountStatus: []
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

describe('Restartable Workspace Launcher', () => {
  const defaultProps = {
    projectId: 'projectId',
    projectName: 'projectName',
    ownerName: 'ownerName',
    currentUserName: 'currentUserName',
    currentUserId: 'currentUserId',
    canUseDatasets: false,
    project: mockProject,
    enableSparkClusters: false,
    enableRayClusters: false,
    enableDaskClusters: false,
    launchMode: 'create' as LaunchMode
  };

  const workspaceClusterConfig: NewClusterProperties | OldClusterProperties = {
    executorHardwareTierId: {value: 'small-k8s'},
    masterHardwareTierId: {value: 'small-k8s'},
    computeEnvironmentId: 'env-id',
    computeEnvironmentRevisionSpec: 'ActiveRevision',
    executorCount: 2
  };

  const launcherProps: RestartableWorkspaceLauncherInternalProps = {
    accessControl: {
      hasAccessToResource: () => false,
      hasAccess: () => true,
    },
    canUseDatasets: true,
    clusterAdded: false,
    clusterProperties: undefined,
    currentUserName: 'integration-test',
    workspaceClusterConfig,
    enableExternalDataVolumes: true,
    enableSparkClusters: true,
    enableRayClusters: false,
    enableDaskClusters: false,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
    ownerName: 'integration-test',
    project: mockProject,
    projectId: '5a6fd2c7e4b0e1ee4ae0bc70',
    projectName: 'quick-start',
    selectedHardwareTierId: 'test-clone',
    selectedWorkspaceDefinitionTitle: undefined,
    workspace: undefined,
    workspaceDefinitionId: undefined,
    workspaceTitle: undefined,
    launchMode: 'create' as LaunchMode,
    externalVolumeMounts: [],
    previousValuesStorageKey: 'previousValuesStorageKey'
  };
  const launcherPropsForGitFirstProject = mergeDeepRight(launcherProps, {
    project: {mainRepository: {id: 'main-repo-id', serviceProvider: 'github', uri: 'http://git'}},
    isGitBased: true,
    enabledGitRepositories: [{
      id: 'main-repo-id',
      name: 'mainreponame',
      uriHost: 'host',
      uriPort: 'port',
      uriPath: '/path',
      serviceProvider: 'github',
      isFeatureStore: false
    }],
  });

  // functions in DOM Testing Library use the attribute data-testid by default
  // we can override this value via configure({testIdAttribute: 'data-my-test-attribute'})
  // https://testing-library.com/docs/queries/bytestid/#overriding-data-testid
  configure({ testIdAttribute: 'data-test' });

  it('should render Workspace Modal', async () => {
    const view = render(
      <TestableReduxContainer>
        <Router>
          <Launcher
            {...defaultProps}
          />
        </Router>
      </TestableReduxContainer>
    );
    const createNewWsBtn = view.getByDominoTestId('new-workspace');
    fullClick(createNewWsBtn);
    await waitFor(() => expect(view.getByDominoTestId('workspace-launcher')).toBeTruthy());
  });

  it('should display code step for a Git Based Project', async () => {
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher {...launcherPropsForGitFirstProject} />
        </Router>
      </TestableReduxContainer>);
    configure({ testIdAttribute: 'data-test' });
    const gitContent = within(view.getByDominoTestId('step-2-content')).queryByText(' Code Repo');
    await waitFor(() => expect(gitContent).toBeNull());
  });

  it('should not display code step for a DFS project', async () => {
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher {...launcherProps} />
        </Router>
      </TestableReduxContainer>);
    configure({ testIdAttribute: 'data-test' });
    const gitContent = view.queryByText('Code Repo');
    await waitFor(() => expect(gitContent).toBeNull());
  });

  it('should enable autoscale checkbox and populate max worker count with maxWorkerCount when defaultMaxWorkerCount is available', async () => {

    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
            {...{
              ...launcherProps,
              enableSparkClusters: true,
              workspaceClusterConfig: {
                ...launcherProps.workspaceClusterConfig,
                maxWorkerCount: defaultMaxWorkerCount,
                workerHardwareTierId: {value: 'small-k8s'},
                workerCount: 2,
                clusterType: 'Spark'
              } as NewClusterProperties
            }}
            workspace={mockWorkspace}
          />
        </Router>
      </TestableReduxContainer>);
    await waitFor(() => expect(view.getByDominoTestId('name0')).toBeTruthy());
    const step2Jump = view.getByDominoTestId('step-2-jump').firstElementChild as HTMLElement
    fullClick(step2Jump);
    await waitFor(() => expect(view.getByDominoTestId("worker-maxSize")).toBeTruthy());
    expect(view.getByDominoTestId("worker-maxSize").getAttribute('value')).toEqual(`${defaultMaxWorkerCount}`);
  });

  describe('switching through all three steps using the "Next" button', () => {
    let view: RenderResult<{
      getByDominoTestId: QueryMethod<[id: string], HTMLElement>;
      getByText: QueryMethod<[id: string], HTMLElement>;
      getAllByText: QueryMethod<[id: string], HTMLElement[]>;
    }>

    beforeEach(() => {
      view = render(
        <TestableReduxContainer>
          <Router>
            <RestartableWorkspaceLauncher {...launcherPropsForGitFirstProject}
              workspace={mockWorkspace}
            />
          </Router>
        </TestableReduxContainer>
      );
    })

    test('starts at "Environment & Hardware"', async () => {
      await waitFor(() => expect(view.getByDominoTestId('step-1-jump').className.indexOf('ant-steps-item-active')).toBeGreaterThanOrEqual(0));
    });

    test('goes to "Code" on first click', async () => {
      await waitFor(() => expect(view.getByDominoTestId('name0')).toBeTruthy());
      await waitFor(() => expect(view.getByText('test-clone')).toBeTruthy());
      await waitFor(() => expect(view.getAllByText('Domino Standard Environment Py3.8 R4.1').length).toEqual(2));
      const step1NextBtn = view.getByDominoTestId('step-0-change');
      fullClick(step1NextBtn);
      await waitFor(() => expect(view.getByDominoTestId('step-2-jump').className.indexOf('ant-steps-item-active')).toBeGreaterThanOrEqual(0));
    });

    test('goes to "Additional Details" step on second click', async () => {
      await waitFor(() => expect(view.getByDominoTestId('name0')).toBeTruthy());
      await waitFor(() => expect(view.getByText('test-clone')).toBeTruthy());
      await waitFor(() => expect(view.getAllByText('Domino Standard Environment Py3.8 R4.1').length).toEqual(2));
      const step1NextBtn = view.getByDominoTestId('step-0-change');
      fullClick(step1NextBtn);
      await waitFor(() => expect(view.getByDominoTestId('step-1-change')).toBeTruthy());
      const step2NextBtn = view.getByDominoTestId('step-1-change');
      fullClick(step2NextBtn);
      await waitFor(() => expect(view.getByDominoTestId('step-3-jump').className.indexOf('ant-steps-item-active')).toBeGreaterThanOrEqual(0));
    });

  });

  describe('Workspace launch validation', () => {

    it(`should disable launch button when a workspace IDE isn't selected and clicked on launch button`, async () => {
      const getAvailableToolsForEnvironment = jest.spyOn(Workspaces, 'getAvailableToolsForEnvironment');
      getAvailableToolsForEnvironment.mockImplementation(async () => ({
        workspaceTools: [],
      }));

      const view = render(
        <TestableReduxContainer>
          <Router>
            <RestartableWorkspaceLauncher {...{
              ...launcherPropsForGitFirstProject,
              workspace: mergeDeepRight(
                mockWorkspace,
                {
                  configTemplate: {
                    tools: []
                  }
                }
              )
            }} />
          </Router>
        </TestableReduxContainer>);
      const launchBtn = view.getByDominoTestId("launch-now");
      fullClick(launchBtn);
      await waitFor(() => expect(view.getByDominoTestId("worker-maxSize")).toBeTruthy());
      await waitFor(() => expect(view.getByDominoTestId("launch-now").hasAttribute('disabled')).toBeTruthy());
    });

    it(`should enable launch button when there is at least 1 workspace IDE \
        where the workspace should be auto-selected and clicked on launch button`, async () => {
      const getAvailableToolsForEnvironment = jest.spyOn(Workspaces, 'getAvailableToolsForEnvironment');
      getAvailableToolsForEnvironment.mockImplementation(async () => ({
        workspaceTools: mockWorkspaceDefinitions.slice(0,1),
      }));

      const view = render(
        <TestableReduxContainer>
          <Router>
            <RestartableWorkspaceLauncher {...{
              ...launcherPropsForGitFirstProject,
              workspace: mergeDeepRight(
                mockWorkspace,
                {
                  configTemplate: {
                    tools: []
                  }
                }
              )
            }} />
          </Router>
        </TestableReduxContainer>);
      const launchBtn = view.getByDominoTestId("launch-now");
      fullClick(launchBtn);
      await waitFor(() => expect(view.getByDominoTestId("worker-maxSize")).toBeTruthy());
      await waitFor(() => expect(view.getByDominoTestId("launch-now").hasAttribute('disabled')).toBeFalsy());
    });

    it(`should disable launch button when an environment isn't selected for the spark cluster and clicked on launch button`, async () => {
      const getUseableEnvironments = jest.spyOn(Projects, 'getUseableEnvironments');
      getUseableEnvironments.mockImplementation(async () => mergeDeepRight(mockUsableEnvs, {
        environments: []
      }));
      const view = render(
        <TestableReduxContainer>
          <Router>
            <RestartableWorkspaceLauncher {...{
              ...launcherPropsForGitFirstProject,
              workspace: mockWorkspace
            }} />
          </Router>
        </TestableReduxContainer>);
      await waitFor(() => expect(view.getByText('test-clone')).toBeTruthy());
      const launchBtn = view.getByDominoTestId("launch-now");
      fullClick(launchBtn);
      await waitFor(() => expect(view.getByDominoTestId("launch-now").hasAttribute('disabled')).toBeTruthy());
    });

    it(`should show credentials refresh modal when workspace launch is tried with expired credentials`, async () => {
      require('@domino/api/dist/Workspace')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .createAndStartWorkspace.mockImplementation((_: any) => Promise.resolve({redirectPath: 'redirectPath'}));
        const getAvailableToolsForEnvironment = jest.spyOn(Workspaces, 'getAvailableToolsForEnvironment');
        getAvailableToolsForEnvironment.mockImplementation(async () => ({
          workspaceTools: mockWorkspaceDefinitions
        }));

      const view = render(
        <TestableReduxContainer>
          <Router>
            <RestartableWorkspaceLauncher {...launcherPropsForGitFirstProject}
              workspace={mockWorkspace}
            />
          </Router>
        </TestableReduxContainer>
      );
        await waitFor(() => expect(view.getByDominoTestId('jupyter')).toBeTruthy());
        await waitFor(() => expect(view.getByText('test-clone')).toBeTruthy());
        await waitFor(() => expect(view.getAllByText('Domino Standard Environment Py3.8 R4.1').length).toEqual(2));
        const step1NextBtn = view.getByDominoTestId('step-0-change');
        fullClick(step1NextBtn);
        const launchBtn = view.getByDominoTestId("launch-now");
        fullClick(launchBtn);
        await waitFor(() => expect(view.getByDominoTestId("acquireAuthorizationModal")).toBeTruthy());
    });

    it(`Should show an on button spinner when clicked on 'Launch Now' button`, async() => {
      const spy = () => new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({});
        }, 3000);
      });
      const createAndStartWorkspace = jest.spyOn(Workspace, 'createAndStartWorkspace');
      createAndStartWorkspace.mockImplementation(spy);

        const view = render(
          <TestableReduxContainer>
            <Router>
              <RestartableWorkspaceLauncher
              {...{
                ...launcherProps,
                enableSparkClusters: true,
                workspaceClusterConfig: undefined
              }}
                workspace={mockWorkspace}
              />
            </Router>
          </TestableReduxContainer>
        );
          await waitFor(() => expect(view.getByDominoTestId('jupyter')).toBeTruthy());
          await waitFor(() => expect(view.getByText('test-clone')).toBeTruthy());
          const launchBtn = view.getByDominoTestId("launch-now");
          fullClick(launchBtn);
          await waitFor(() => expect(within(view.getByDominoTestId("launch-now")).getByTestId('loading-spinner')).toBeTruthy());
    });
  });

  it('should allow immediate submission in a Git Based Project', async () => {
      const spy = () => new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({});
        }, 3000);
      });
    const createAndStartWorkspace = jest.spyOn(Workspace, 'createAndStartWorkspace');
    createAndStartWorkspace.mockImplementation(spy);

    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
            {...launcherPropsForGitFirstProject}
            enableSparkClusters={true}
            workspaceClusterConfig={undefined}
            workspace={mockWorkspace}
        />
        </Router>
      </TestableReduxContainer>);

    await waitFor(() => expect(view.getByText('test-clone')).toBeTruthy());
    const launchBtn = view.getByDominoTestId("launch-now");
    fullClick(launchBtn);

    await waitFor(() => expect(within(view.getByDominoTestId("launch-now")).getByTestId('loading-spinner')).toBeTruthy());
  });

  it(`Should show the workspace's spark volumeSize on Edit when workspace has spark volumeSize`, async () => {
    const volumeSize = {value: 5, unit: 'GiB'};
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
            {...{
              ...launcherProps,
              launchMode: 'edit',
              workspaceClusterConfig: {
                ...launcherProps.workspaceClusterConfig,
                volumeSize: volumeSize
              } as DominoWorkspaceApiWorkspaceClusterConfigDto,
              workspace: mergeDeepRight(
                mockWorkspace,
                {
                  configTemplate: {
                    clusterProps: {
                      volumeSize: volumeSize,
                      computeEnvironment: {id: 'computeEnvironmentId'},
                      masterHardwareTierId: {value: 'hwtierId'},
                      executorHardwareTierId: {value: 'execHwteir'}
                    }
                  }
                }
              )
            }}
          />
        </Router>
      </TestableReduxContainer>);

    await waitFor(() => expect(view.getByDominoTestId('local-storage-for-executors').getAttribute('value')).toEqual(`${volumeSize.value}`));
  });

  it(`Should be able to clear input and enter any number in workspace's spark "Dedicated local storage per executor"`, async () => {
    const volumeSize = {value: 5, unit: 'GiB'};
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
            {...{
              ...launcherProps,
              launchMode: 'edit',
              workspaceClusterConfig: {
                ...launcherProps.workspaceClusterConfig,
                volumeSize: volumeSize
              } as DominoWorkspaceApiWorkspaceClusterConfigDto,
              workspace: mergeDeepRight(
                mockWorkspace,
                {
                  configTemplate: {
                    clusterProps: {
                      volumeSize: volumeSize,
                      computeEnvironment: {id: 'computeEnvironmentId'},
                      masterHardwareTierId: {value: 'hwtierId'},
                      executorHardwareTierId: {value: 'execHwteir'}
                    }
                  }
                }
              )
            }}
          />
        </Router>
      </TestableReduxContainer>);

    await waitFor(() => expect(view.getByDominoTestId('local-storage-for-executors').getAttribute('value')).toEqual(`${volumeSize.value}`));
    await userEvent.clear(view.getByDominoTestId('local-storage-for-executors'));
    await userEvent.type(view.getByDominoTestId('local-storage-for-executors'), '10');
    await waitFor(() => expect(view.getByDominoTestId('local-storage-for-executors').getAttribute('value')).toEqual('10'));
  });

  it('should display volume size selector in the first step when launchMode is create', async () => {
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
          {...launcherPropsForGitFirstProject}
          launchMode="create"
          />
        </Router>
      </TestableReduxContainer>);
    await waitFor(() => expect(within(view.getByDominoTestId('step-1-content')).getByTestId('volume-size')).toBeTruthy());
  });

  it('should render a tooltip when hovering on `Volume Size` title which should have a link that redirects to `Project Settings` page', async () => {
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
            {...launcherPropsForGitFirstProject}
            launchMode="create"
          />
        </Router>
      </TestableReduxContainer>);
    await waitFor(() => expect(within(view.getByDominoTestId('step-1-content')).getByTestId('volume-size')).toBeTruthy());
    const volumeSizeTitle = view.getByText(/Volume Size/);
    fireEvent.mouseOver(volumeSizeTitle);
    await waitFor(() => expect(view.getByText(/Project Settings/)).toBeTruthy());
    const linkToProjectSettings = view.getByText(/Project Settings/);
    const { currentUserName, projectName } = launcherProps;
    expect(linkToProjectSettings.getAttribute('href')).toEqual(projectSettings('execution')(currentUserName, projectName));
  });

  it('should not display volume size selector in the first step when launchMode is edit', async () => {
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
          {...launcherPropsForGitFirstProject}
          launchMode="edit"
          />
        </Router>
      </TestableReduxContainer>);
    const voulmeSizeSelector = within(view.getByDominoTestId('step-1-content')).queryByTestId('volume-size');
    await waitFor(() => expect(voulmeSizeSelector).toBeNull());
  });

  it('should display the values fetch from project settings API in the default and recommended options for volume selector', async () => {
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
          {...launcherPropsForGitFirstProject}
          launchMode="create"
          />
        </Router>
      </TestableReduxContainer>);
    await waitFor(() => expect(within(view.getByDominoTestId('step-1-content')).getByTestId('volume-size')).toBeTruthy());
    await waitFor(() => expect(view.getByTestId('volume-size-projectSetting-content').textContent).toContain(`${defaultVolumeSizeGiB}GiB`));
    await waitFor(() => expect(view.getByTestId('volume-size-recommendedSetting-content').textContent).toContain(`${recommendedVolumeSizeGiB}GiB`));
  });

  it('should not display volume size selector in the first step when the EnableDiskUsageVolumeCheck FF is off', async () => {
    // This removes principal from global store such that the principal API fetches again on component mount
    GlobalStore.removeItem(storageKeys.principal);
    mocks.api.auth.getPrincipal.mockResolvedValue({
      isAnonymous: true,
      isAdmin: false,
      allowedSystemOperations: [],
      featureFlags: [],
      booleanSettings: [],
      mixpanelSettings: {
        frontendClientEnabled: true,
        backendClientEnabled: true,
        token: 'token',
      }
    });
    const view = render(
      <TestableReduxContainer>
        <Router>
          <RestartableWorkspaceLauncher
          {...launcherPropsForGitFirstProject}
          launchMode="create"
          formattedPrincipal={{
            ...formattedPrincipalInitialState,
            enableDiskUsageVolumeCheck: false
          }}
          />
        </Router>
      </TestableReduxContainer>);
    const volumeSizeSelector = within(view.getByDominoTestId('step-1-content')).queryByTestId('volume-size');
    await waitFor(() => expect(volumeSizeSelector).toBeNull());
  });
});
