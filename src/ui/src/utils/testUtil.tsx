import {
  DominoWorkspaceApiWorkspaceQuotaStatusDto as WorkspaceQuotaStatusDto,
  DominoWorkspacesApiWorkspace as WorkspaceType,
  DominoWorkspaceApiWorkspaceDto as WorkspaceDto,
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
  DominoProvenanceApiProvenanceCheckpointDto as Checkpoint,
  DominoNucleusLibAuthPrincipalWithFeatureFlags as Principal,
  DominoNucleusProjectProjectSettingsDto as ProjectSettings,
  DominoWorkspacesApiAvailableWorkspaceTools as WorkspaceTools,
  DominoWorkspacesApiWorkspaceDefinitionDto as WorkspaceDefinition,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity,
  DominoDataplaneDataPlaneDto as DataPlaneDto,
  StorageUnit,
  DominoJobsInterfaceJob as Job,
  DominoEnvironmentsApiPaginatedRevisionData,
  DominoEnvironmentsApiEnvironmentDetails,
} from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import * as Admin from '@domino/api/dist/Admin';
import * as Gateway from '@domino/api/dist/Gateway';
import * as Projects from '@domino/api/dist/Projects';
import * as Auth from '@domino/api/dist/Auth';
import * as Workspace from '@domino/api/dist/Workspace';

export const principal: Principal = {
  "isAnonymous": false,
  "isAdmin": true,
  "canonicalId": "5d929bd2d721227b4bb35db2",
  "canonicalName": "mom",
  "allowedSystemOperations": [
    "ActAsProjectAdmin",
    "EditEnvironmentsAsOwner",
    "ManageBuilds",
    "ViewSearchIndex",
    "SetUserSystemRoles",
    "StopRuns",
    "ManageProjectTags",
    "ReadKubernetes",
    "UseK8sDashboard",
    "ExecuteRunsForFree",
    "UpdateUser",
    "ViewMetrics",
    "ResetIndex",
    "ManageHardwareTiers",
    "ViewRevenue",
    "ViewEverythingInControlCenter",
    "RestartNucleus",
    "ViewUserList",
    "TriggerSearchIndexing",
    "ManageFeatureFlags",
    "GeneratePasswordResetLinks",
    "ViewProjectList",
    "CurateProjects",
    "ViewExecutors",
    "ManageOrganizations",
    "ViewAdminMenu",
    "ManageEnvironments",
    "ViewUsage",
    "ViewProjectSizes",
    "StopServer",
    "RunMongoDBCommands",
    "ListAllProjects",
    "ViewGlobalEnvironments",
    "ViewAdminDashboard",
    "PreviewProjects",
    "EditCentralConfig",
    "ManageExecutors"
  ],
  "featureFlags": [
    "AppPublishingEnabled",
    "ShortLived.CommentsPreviewEnabled",
    "ShortLived.GitReferencesCustomizableEnabled",
    "ShortLived.ExecuteHtmlInMarkdown",
    "ShortLived.UserExecutionsQuotaEnabled",
    "ShortLived.WriteLogsToNewIndices",
    "ShortLived.KubernetesContainerMetricsEnabled",
    "ShortLived.ExecutionEventHistoryInLogsEnabled",
    "ShortLived.DSLEnabled",
    "ShortLived.PluggableInteractiveSessionSubdomains",
    "ShortLived.EnableEnvironmentRevisions",
    "ShortLived.EnableReadWriteDatasets"
  ],
  "booleanSettings": [
    "enableProjectTagging",
    "publicProjectsEnabled",
    "publicModelProductsEnabled"
  ],
  "mixpanelSettings": {
    'frontendClientEnabled': true,
    'backendClientEnabled': true,
    'token': '12345'
  },
  "globalBannerSettings": {
    'isClosable': false
  },
  "docsRoot": ''
};

export const user = {
  "firstName": "mom",
  "lastName": "mom",
  "fullName": "mom mom",
  "userName": "mom",
  "email": "mom@mom.com",
  "avatarUrl": "",
  "id": "5d929bd2d721227b4bb35db2"
};

export const project: Project = {
  "id": "5d939a6118e416527f55e96c",
  "name": "public",
  "owner": { "id": "5d929bd2d721227b4bb35db2", "userName": "mom" },
  "description": "",
  "hardwareTierName": "Kubernetes",
  "hardwareTierId": "kubernetes",
  "environmentName": "Default",
  "allowedOperations": [
    "BrowseReadFiles",
    "ProjectSearchPreview",
    "Run",
    "ChangeProjectSettings",
    "ViewRuns",
    "RunLauncher",
    "Edit",
    "ViewWorkspaces",
    "EditTags",
    "UpdateProjectDescription"
  ],
  "visibility": "Public",
  "tags": [],
  "updatedAt": "2019-10-01T18:26:43.169Z",
  "numComments": 0,
  "runsCountByType": [
    { "runType": "App", "count": 0 },
    { "runType": "Batch", "count": 0 },
    { "runType": "Workspace", "count": 0 }
  ],
  "totalRunTime": "PT0S",
  "stageId": "5d92372218e4166531067538",
  "status": { "status": "active", "isBlocked": false },
  "requestingUserRole": "Owner"
};

export const whiteLabelConfiguration = {
  "errorPageContactEmail": "support+develop@dominodatalab.com",
  "defaultProjectName": "quick-start",
  "favicon": "/favicon.ico",
  "gitCredentialsDescription": "Authenticate Domino for access to your Git repositories via <strong>GitHub Personal Access Token (PAT)</strong> or <strong>Private SSH Key</strong>.",
  "helpContentUrl": "https://tickets.dominodatalab.com",
  "hidePopularProjects": false,
  "hideDownloadDominoCli": false,
  "hideMarketingDisclaimer": false,
  "hidePublicProjects": false,
  "hideSearchableProjects": false,
  "hideSuggestedProjects": false,
  "hideLearnMoreOnFile": false,
  "hideGitSshKey": false,
  "appName": "Domino",
  "pageFooter": "",
  "showSupportButton": false,
  "supportEmail": "support+develop@dominodatalab.com"
};

export const projectStageAndStatus: ProjectStageAndStatus[] = [{
  'id': '5d32334afee21d0006f92724',
  'name': 'D',
  'stage': {
    'id': '5cc93b1058c93f0006276adf',
    'stage': 'Ideation',
    'createdAt': 1556691728917,
    'isArchived': false,
    'stageCreationSource': 'Domino'
  },
  'status': { 'status': 'active', 'isBlocked': true }
}];

export const projectGet = () => {
  const findProjectByOwnerAndName = jest.spyOn(Gateway, 'findProjectByOwnerAndName');
  return findProjectByOwnerAndName.mockImplementation;
};

export const projectStageAndStatusGet = () => {
  const getCurrentProjectStageAndStatus = jest.spyOn(Projects, 'getCurrentProjectStageAndStatus');
  return getCurrentProjectStageAndStatus.mockImplementation;
};

export const principalGet = () => {
  const getPrincipal = jest.spyOn(Auth, 'getPrincipal');
  return getPrincipal.mockImplementation;
};

export const whitelabelConfigGet = () => {
  const getWhiteLabelConfigurations = jest.spyOn(Admin, 'getWhiteLabelConfigurations');
  return getWhiteLabelConfigurations.mockImplementation;
};

export const pageLoadBasicMocks = () => {
  projectGet()(async () => project);
  projectStageAndStatusGet()(async () => projectStageAndStatus[0]);
  principalGet()(async () => principal);
  whitelabelConfigGet()(async () => whiteLabelConfiguration);
};

export const workspace: WorkspaceDto = {
  id: '5f44ee5f172fdf43f700b0a4',
  deleted: false,
  projectId: '5f3c1afe91c2b54ae7064fff',
  ownerId: '5f3c1afea8512c58ef860448',
  ownerName: 'Owner name',
  name: 'Jupyter (Python, R, Julia) session',
  state: 'Stopped',
  stateUpdatedAt: '2020-03-05T07:18:48.654Z',
  createdAt: '2020-03-05T07:18:48.654Z',
  importedProjects: [],
  importedGitRepos: [],
  dataPlaneId: '5f44ee5f172fdf43f700b0a5',
  initConfig: {
    volumeSize: { value: 100, unit: 'GiB' }
  },
  configTemplate: {
    environment: {
      id: '5f365bf8c981e722bd2a1aa1',
      name: 'Default',
      revisionId: '5f5a090dd97fb54c531c3cb3',
      revisionNumber: 1,
      revisionType: 'Active',
      isRestricted: false,
    },
    hardwareTier: { id: { value: 'kubernetes' }, name: 'hardware tier name' },
    tools: ['jupyter']
  },
  sessionStats: { runTimeSec: 0 },
  isLegacy: false,
  isReproduced: false
};

export const mockWorkspace: WorkspaceType = {
  id: 'id',
  projectId: 'projectId',
  title: 'title',
  definitionTitle: 'definitionTitle',
  stageTime: { submissionTime: 1 },
  number: 1,
  isCompleted: true,
  isArchived: false,
  queuedWorkspaceHistoryDetails: { expectedWait: 'string', explanation: 'explanation', helpText: 'helpText' },
  tags: [
    { tagId: 'tagId0', name: 'name0', createdBy: 'today', createdAt: 1, projectId: 'Id0' },
    { tagId: 'tagId1', name: 'name1', createdBy: 'yesterday', createdAt: 2, projectId: 'Id1' }
  ],
  commentsCount: 3,
  status: 'status',
  inputCommitId: 'commitId0',
  dominoStats: [{ name: 'name0', value: 'val0' }, { name: 'name1', value: 'val1' }],
  dependentRepositories: [
    { id: 'id0', name: 'name0', uri: 'uri0', ref: 'ref0', serviceProvider: 'aws' },
    { id: 'id1', name: 'name1', uri: 'uri1', ref: 'ref1', serviceProvider: 'gcp' },
    { id: 'id2', name: 'name2', uri: 'uri2', ref: 'ref2', serviceProvider: 'azure' }
  ],
  dependentDatasetMounts: [
    { datasetId: 'Id0', datasetName: 'name0', projectId: 'projId0', isInput: true },
    { datasetId: 'Id1', datasetName: 'name1', projectId: 'projId1', isInput: true }
  ],
  dependentProjects: [
    { projectId: 'projectId0', commitId: 'commitId0' },
    { projectId: 'projectId1', commitId: 'commitId1' }
  ],
  isRestartable: true,
  dependentExternalVolumeMounts: [{
    name: 'name0',
    mount: { mountPath: 'path', readOnly: false }
  }]
};

export enum ProjectDetails {
  projectId = '5e60a7d50cf22210b88f3747',
  projectName = 'projectName',
  projectOwnerName = 'integration-test',
  loggedInUserId = 'nine_tailed_fox'
}

export const mockCheckpoint: Checkpoint = {
  id: 'id',
  projectId: ProjectDetails.projectId,
  executionId: 'executionId',
  executionName: 'executionName',
  executionStart: 'executionStart',
  createdAt: 'createdAt',
  environmentDetails: {
    environmentId: 'environmentId',
    environmentRevisionId: 'environmentRevisionId',
    environmentName: 'environmentName',
    environmentRevisionNumber: 123,
  },
  commitMessage: 'this is a mock commit message',
  dfsCommit: { commitId: '0123456789', branchName: 'branch01' },
  gitRepoCommits: [
    { id: 'id0', name: 'name0', commitId: '0123456789', branchName: 'branchName0', isMainRepo: true },
    { id: 'id1', name: 'name1', commitId: '0987654321', branchName: 'branchName1', isMainRepo: false }
  ],
  importedProjects: [
    {
      projectId: ProjectDetails.projectId,
      projectName: ProjectDetails.projectName,
      ownerId: 'ownerId',
      commitId: '12345f892388342',
    },
    {
      projectId: ProjectDetails.projectId,
      projectName: ProjectDetails.projectName,
      ownerId: 'ownerId',
      commitId: '67890f892388343'
    }
  ],
  hardwareTierId: { value: 'kubernetes' },
  hardwareTierName: 'Small',
  volumeSize: { value: 2, unit: 'GB' as StorageUnit },
  environmentVariables: {
    projectEnvVarBlobKeys: ['0', '1', '2', '3', '4'],
    projectVarVersions: [{ projectId: '5e60a7d50cf22210b88f3747', version: 1 }],
  },
  dfsBranch: 'master',
  isolateOutputCommits: false,
  attributes: {},
};

export const mockProjectSettings: ProjectSettings = {
  defaultEnvironmentId: 'test-env',
  defaultEnvironmentRevisionSpec: 'ActiveRevision',
  defaultHardwareTierId: 'test-clone-clone-clone',
  sparkClusterMode: 'Local',
  defaultVolumeSizeGiB: 2,
  maxVolumeSizeGiB: 32,
  minVolumeSizeGiB: 0,
  recommendedVolumeSizeGiB: 5,
};

export const mockQuotaStatus: WorkspaceQuotaStatusDto = {
  status: 'QuotaNotExceeded',
  currentValue: 10,
  limit: 100
};

export const getQuotaMock = () => {
  const quotaMockApi = jest.spyOn(Workspace, 'quotaStatus');
  return quotaMockApi.mockImplementation(jest.fn(() => Promise.resolve(mockQuotaStatus)));
};

export const getCheckpointForCommitsMock = () => {
  const quotaMockApi = jest.spyOn(Workspace, 'getCheckpointForCommits');
  return quotaMockApi.mockImplementation(jest.fn(() => Promise.resolve(mockCheckpoint)));
};

export const mockWorkspaceDefinitions: Array<WorkspaceDefinition> = [
  { id: 'id0', name: 'name0', title: 'title0', iconUrl: 'iconUrl0' },
  { id: 'id1', name: 'name1', title: 'title1', iconUrl: 'iconUrl1' },
  { id: 'id2', name: 'name2', title: 'title2', iconUrl: 'iconUrl2' },
  { id: 'id3', name: 'name3', title: 'title3', iconUrl: 'iconUrl3' }
];

export const mockWorkspaceTools: WorkspaceTools = { workspaceTools: mockWorkspaceDefinitions };

export const mockDataPlane: DataPlaneDto = {
  'id': '000000000000000000000000',
  'name': '',
  'namespace': 'domino-compute',
  'isLocal': true,
  'configuration': {
    'storageClass': 'gp2'
  },
  'status': {
    'state': 'Healthy',
    'version': '5.3.0',
    'message': '',
    'requiresUpgrade': false,
  },
  'isHealthy': true,
  'isArchived': false,
  'isFileSyncDisabled': false,
};

export const hardwareTierData: HardwareTierWithCapacity[] = [
  {
    'hardwareTier': {
      'id': 'test-clone-clone-clone',
      'name': 'test-clone-clone-clone',
      'cores': 1,
      'memory': 0.001,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': true,
      'isDataAnalystTier': false,
      'centsPerMinute': 10,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 0,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 0,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 0,
      'capacityLevel': 'FULL'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'test-clone',
      'name': 'test-clone',
      'cores': 4,
      'memory': 16,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 5,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 0,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 0,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 0,
      'capacityLevel': 'FULL'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'test-hardware-tier-id',
      'name': 'test-hardware-tier-id',
      'cores': 4,
      'memory': 16,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 5,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 0,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 0,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 0,
      'capacityLevel': 'FULL'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'medium',
      'name': 'Medium (m4.xlarge, dedicated to 1 run) hulubulu bubulyy',
      'cores': 4,
      'memory': 16,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': true,
      'centsPerMinute': 2,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 15,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 15,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 15,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'test',
      'name': 'test',
      'cores': 4,
      'memory': 16,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 3.3333333333,
      'isFree': true,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 0,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 1,
      'maximumConcurrentRuns': 0,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 0,
      'capacityLevel': 'FULL'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'large',
      'name': 'Large (m4.4xlarge, dedicated to 1 run)',
      'cores': 16,
      'memory': 64,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 20,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 10,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 10,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 10,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'p3-gpu',
      'name': 'GPU (p3.2xlarge, dedicated to 1 run)',
      'cores': 8,
      'memory': 61,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 1,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default-gpu',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 0,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 10,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 10,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 10,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'like-default',
      'name': 'like-default-test',
      'cores': 8,
      'memory': 32,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 0,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 8,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 32,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 32,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'test-clone-clone',
      'name': 'test-clone-clone',
      'cores': 4,
      'memory': 16,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 0,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 4,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 16,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 16,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'gpu',
      'name': 'GPU (p2.xlarge, dedicated)',
      'cores': 8,
      'memory': 15,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 1,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default-gpu',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 0,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 4,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 4,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 4,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'default',
      'name': 'Default (m4.2xlarge, shared w/ 4 runs)',
      'cores': 8,
      'memory': 32,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': true,
      'isDataAnalystTier': false,
      'centsPerMinute': 0,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 6,
      'maximumNumberOfExecutors': 8,
      'numberOfCurrentlyExecutingRuns': 18,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 32,
      'availableCapacityWithoutLaunching': 2,
      'maximumAvailableCapacity': 14,
      'capacityLevel': 'CAN_EXECUTE_WITH_CURRENT_INSTANCES'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'd-endpoint',
      'name': 'API Endpoints and Apps (m4.xlarge, shared w/ 4 runs)',
      'cores': 4,
      'memory': 16,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 0,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 4,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 16,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 16,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  },
  {
    'hardwareTier': {
      'id': 'dvolk-l-clone',
      'name': 'dvolk-l-clone',
      'cores': 16,
      'memory': 64,
      'allowSharedMemoryToExceedDefault': false,
      'gpuConfiguration': {
        numberOfGpus: 0,
        gpuKey: 'nvidia.com/gpu'
      },
      'nodePool': 'default',
      'clusterType': 'Kubernetes',
      'isDefault': false,
      'isDataAnalystTier': false,
      'centsPerMinute': 0,
      'isFree': false,
      'isAllowedDuringTrial': false,
      'isVisible': true,
      'isGlobal': true,
      'isArchived': false,
      'creationTime': '2019-05-08T19:12:13Z',
      'updateTime': '2019-05-08T19:12:13Z',
      'podCustomization': {
        'additionalRequests': {},
        'additionalLimits': {},
        'additionalAnnotations': {},
        'additionalLabels': {},
        'hugepages': {},
        'capabilities': []
      },
      'metadata': {},
    },
    'capacity': {
      'currentNumberOfExecutors': 0,
      'maximumNumberOfExecutors': 10,
      'numberOfCurrentlyExecutingRuns': 0,
      'numberOfQueuedRuns': 0,
      'maximumConcurrentRuns': 10,
      'availableCapacityWithoutLaunching': 0,
      'maximumAvailableCapacity': 10,
      'capacityLevel': 'REQUIRES_LAUNCHING_INSTANCE'
    },
    'dataPlane': mockDataPlane,
  }
];

export const getUseableEnvironmentsSelectedNotOnDemandSpark = {
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

export const mockRevisions: DominoEnvironmentsApiPaginatedRevisionData = {
  revisions: [
    { id: '61a73748d04758372110231e', number: 3, created: 1638348616973 },
    { id: 'test-revision-id', number: 2, created: 1638175949915 },
    { id: '61a46956f04e9e5137a593b5', number: 1, created: 1638164821975 }],
  pageInfo: {
    totalPages: 1,
    currentPage: 0,
    pageSize: 20
  }
};

export const mockEnvironment: DominoEnvironmentsApiEnvironmentDetails = {
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
    availableTools: [{
      id: 'jupyter',
      name: 'jupyter',
      title: 'Jupyter (Python, R, Julia)',
      iconUrl: '/assets/images/workspace-logos/Jupyter.svg',
      start: ['/opt/domino/workspaces/jupyter/start'],
    }]
  },
  selectedRevision: {
    id: '61a73748d04758372110231e',
    number: 3,
    status: 'Succeeded',
    url: '/environments/revisions/61a73748d04758372110231e',
    isRestricted: false,
    availableTools: [{
      id: 'jupyter',
      name: 'jupyter',
      title: 'Jupyter (Python, R, Julia)',
      iconUrl: '/assets/images/workspace-logos/Jupyter.svg',
      start: ['/opt/domino/workspaces/jupyter/start'],
    }]
  }
};

export const mockUsableEnvs = {
  currentlySelectedEnvironment: {
    id: 'id',
    supportedClusters: [ComputeClusterLabels.Spark, ComputeClusterLabels.Ray]
  },
  environments: [
    {
      'id': 'id',
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
  ]
};

export const fileSearchMock = { projectId: 'projectId', commitId: 'commitId', files: ['file1'] };

export const mockJobData: Job = {
  "number": 71,
  "id": "64252fe651253e0e0208410f",
  "queuedJobHistoryDetails": undefined,
  "stageTime": {
    "submissionTime": 1680158694749,
    "runStartTime": 1680158729171,
    "completedTime": 1680158744688
  },
  "tags": [],
  "jobRunCommand": "'main.py'",
  "usage": {
    "cpu": 0.5336512726875393,
    "memory": 3805184
  },
  "startedBy": {
    "id": "63dcaed1ab88e114037d94ca",
    "username": "integration-test"
  },
  "commentsCount": 0,
  "title": "[Rerun] 'custom-metrics-example/mock-train.py'",
  "commitDetails": {
    "inputCommitId": "2ef72c4ad08a42170e5855690981061685913f23",
    "outputCommitId": "bdd2b4691ee45265dc89d676432e33038fd25f45"
  },
  "dominoStats": [],
  "statuses": {
    "isCompleted": true,
    "isArchived": false,
    "isScheduled": false,
    "executionStatus": "Succeeded"
  },
  "mainRepoGitRef": {
    "type": "head"
  },
  "dependentRepositories": [],
  "dependentDatasetMounts": [
    {
      "datasetId": "63dcaedeab88e114037d94d1",
      "snapshotId": "63dcaedeab88e114037d94d0",
      "snapshotVersion": 0,
      "datasetName": "quick-start",
      "projectId": "63dcaed9ab88e114037d94cc",
      "isInput": false,
      "containerPath": "/domino/datasets/local/quick-start"
    },
    {
      "datasetId": "6401283ae524bf5ae245f233",
      "snapshotId": "6401283ae524bf5ae245f232",
      "snapshotVersion": 0,
      "datasetName": "prediction_data",
      "projectId": "63dcaed9ab88e114037d94cc",
      "isInput": false,
      "containerPath": "/domino/datasets/local/prediction_data"
    }
  ],
  "dependentProjects": [],
  "suggestDatasets": false,
  "goalIds": [],
  "runLauncherId": undefined,
  "dependentExternalVolumeMounts": [],
  "computeCluster": undefined,
  "dataPlane": {
    "id": "000000000000000000000000",
    "name": "Local",
    "namespace": "domino-compute",
    "isLocal": true,
    "configuration": {},
    "status": {
      "state": "Healthy",
      "message": "",
      "version": "5.6.0-SNAPSHOT",
      "requiresUpgrade": false,
      "lastHeartbeatTimestamp": 1680158690074
    },
    "isHealthy": false,
    "isArchived": false,
    "isFileSyncDisabled": false,
  },
  "snapshotDatasetsOnCompletion": false,
};


export default {
  principal,
  user,
  project,
  whiteLabelConfiguration,
  principalGet,
  projectStageAndStatus,
  projectGet,
  projectStageAndStatusGet,
  pageLoadBasicMocks,
  workspace,
  mockWorkspace,
  ProjectDetails,
  mockCheckpoint,
  mockProjectSettings,
  mockQuotaStatus,
  getQuotaMock,
  getCheckpointForCommitsMock,
  mockWorkspaceDefinitions,
  mockWorkspaceTools,
  hardwareTierData,
  mockJobData,
  fileSearchMock,
  mockUsableEnvs,
  mockEnvironment,
  mockRevisions,
  getUseableEnvironmentsSelectedNotOnDemandSpark
};
